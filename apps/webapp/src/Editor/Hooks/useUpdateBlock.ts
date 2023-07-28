import { toast } from 'react-hot-toast'

import { findNode, findNodePath, getPlateEditorRef, setNodes } from '@udecode/plate'

import { ELEMENT_PARAGRAPH, useAuthStore, useContentStore } from '@mexit/core'
import { parseToMarkdown } from '@mexit/shared'

import { useBufferStore } from '../../Hooks/useEditorBuffer'
import { useUpdater } from '../../Hooks/useUpdater'
import { PropertiyFields } from '../Components/SuperBlock/SuperBlock.types'
import { getNodeIdFromEditor } from '../Utils/helper'

type BlockDataType = Record<string, any>

const useUpdateBlock = () => {
  const addInBuffer = useBufferStore((b) => b.add)
  const { updateFromContent } = useUpdater()

  /*
    Update block's data in an Editor using element.

    This is used when component isn't a part of Editor
  */
  const insertInEditor = (blockElement: any, blockData: BlockDataType) => {
    const editor = getPlateEditorRef()

    if (editor) {
      const path = findNodePath(editor, blockElement)
      setNodes(editor, blockData, { at: path })
    }
  }

  const changeSuperBlockType = (parentId: string, blockId: string, type: string) => {
    const editor = getPlateEditorRef()
    const updatedBy = useAuthStore.getState().userDetails?.id

    if (editor) {
      const noteId = getNodeIdFromEditor(parentId)
      const nodeEntry = findNode(editor, { block: true, match: { id: blockId } })

      if (nodeEntry) {
        const [element, path] = nodeEntry as any

        const metadata = element.metadata || {}
        const properties = element.properties || {}
        const entity = properties.entity || {}

        setNodes(
          editor,
          {
            metadata: {
              ...metadata,
              updatedBy,
              updatedAt: Date.now()
            },
            type,
            properties: {
              ...properties,
              entity: {
                ...entity,
                active: type
              }
            }
          },
          { at: path, mode: 'highest' }
        )
      }
    }
  }

  const updateMetadataProperties = (element: any, blockData: BlockDataType, nodePath?: any) => {
    const editor = getPlateEditorRef()
    const updatedBy = useAuthStore.getState().userDetails?.id

    if (editor) {
      const path = nodePath ?? findNodePath(editor, element)?.slice(0, 1)

      if (path) {
        const metadata = element.metadata || {}
        const properties = element.properties || {}

        setNodes(
          editor,
          {
            metadata: {
              ...metadata,
              updatedBy,
              updatedAt: Date.now()
            },
            properties: {
              ...properties,
              ...blockData
            }
          },
          { at: path, mode: 'highest' }
        )
      }
    }
  }

  const getNoteContent = (noteId: string) => {
    const bufferContent = useBufferStore.getState().getBuffer(noteId)
    const existingContent = useContentStore.getState().getContent(noteId)?.content

    return bufferContent || existingContent
  }

  /*
    Update block's data inside a Note.

    Use this if you can't access editor directly. For eg, in Tasks view to update status of a task.
  */
  const setInfoOfBlockInContent = (
    noteId: string,
    options: {
      blockId: string
      blockData?: any
      properties?: Partial<PropertiyFields>
      useBuffer?: boolean
    }
  ) => {
    const content = getNoteContent(noteId)

    let updatedBlock

    const updateInBuffer = options.useBuffer !== false

    if (content?.length > 0) {
      const updatedContent = content.map((block) => {
        if (block.id === options.blockId) {
          updatedBlock = {
            ...block,
            ...(options.blockData ?? {}),
            properties: {
              ...(block.properties || {}),
              ...(options.properties || {})
            }
          }

          return updatedBlock
        }

        return block
      })

      if (updateInBuffer) {
        addInBuffer(noteId, updatedContent)
      }

      return updatedBlock
    }
  }

  const insertInNote = (noteId: string, blockId: string, blocks: Array<BlockDataType>) => {
    const content = getNoteContent(noteId)
    if (content) {
      const blockIndex = content.findIndex((b) => b.id === blockId)
      const newContent = [...content]
      newContent.splice(blockIndex, 1, ...blocks)
      addInBuffer(noteId, newContent)
    }
  }

  // Returns true if move block is successful
  const moveBlockFromNode = (fromNoteId: string, toNoteId: string, block: BlockDataType): boolean => {
    const updatedSourceContent = getNoteContent(fromNoteId)
    const updateDestinationContent = getNoteContent(toNoteId)

    if (updateDestinationContent && updatedSourceContent) {
      addInBuffer(toNoteId, [...updateDestinationContent, block])
      addInBuffer(
        fromNoteId,
        updatedSourceContent?.filter((b) => b.id !== block.id)
      )

      return true
    } else {
      toast('Unable to move block')
    }

    return false
  }

  const getSelectionInMarkdown = () => {
    const editor = getPlateEditorRef()
    if (!editor.selection) return

    const nodeFragments = editor.getFragment()
    const selectedText = parseToMarkdown({ children: nodeFragments, type: ELEMENT_PARAGRAPH })?.trim()

    return selectedText
  }

  const addBlockInContent = (noteId: string, block: BlockDataType, type?: 'add' | 'delete') => {
    const content = getNoteContent(noteId)

    if (content?.length > 0) {
      const updatedContent =
        type === 'delete' ? content.filter((b) => b.id !== block.id) : [...content, ...(block as any)]
      updateFromContent(noteId, updatedContent)
    }
  }

  return {
    insertInEditor,
    setInfoOfBlockInContent,
    addBlockInContent,
    getSelectionInMarkdown,
    moveBlockFromNode,
    insertInNote,
    changeSuperBlockType,
    updateMetadataProperties
  }
}

export default useUpdateBlock
