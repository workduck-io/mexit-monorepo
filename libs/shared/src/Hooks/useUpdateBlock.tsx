import { toast } from 'react-hot-toast'

import { findNodePath, getPlateEditorRef, setNodes } from '@udecode/plate'

import {
  ELEMENT_PARAGRAPH,
  emitter,
  getNodeIdFromEditor,
  useAuthStore,
  useBufferStore,
  useContentStore
} from '@mexit/core'

import { PropertiyFields } from '../Components'
import { parseToMarkdown } from '../Utils/utils'

type BlockDataType = Record<string, any>

export const useUpdateBlockHook = () => {
  const addInBuffer = useBufferStore((b) => b.add)

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
        if (!blockData.title)
          //TODO: Add config to ignore certain fields
          emitter.emitPropertyChange(
            properties,
            blockData,
            getNodeIdFromEditor(editor.id),
            properties.templateBlockId || element.id
          ) //Replace element id with templateBlockId from properties
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

  return {
    insertInEditor,
    setInfoOfBlockInContent,
    getSelectionInMarkdown,
    moveBlockFromNode,
    insertInNote,
    getNoteContent,
    updateMetadataProperties
  }
}
