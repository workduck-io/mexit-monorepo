import { findNodePath, getPlateEditorRef, setNodes } from '@udecode/plate'

import { ELEMENT_PARAGRAPH, useContentStore } from '@mexit/core'

import { useBufferStore } from '../../Hooks/useEditorBuffer'
import { useUpdater } from '../../Hooks/useUpdater'
import parseToMarkdown from '../utils'

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

  /*
    Update block's data inside a Note. 

    Use this if you can't access editor directly. For eg, in Tasks view to update status of a task.
  */
  const setInfoOfBlockInContent = (
    noteId: string,
    options: {
      blockId: string
      blockData: BlockDataType
      useBuffer: boolean
    }
  ) => {
    const bufferContent = useBufferStore.getState().getBuffer(noteId)
    const existingContent = useContentStore.getState().getContent(noteId)?.content

    const content = bufferContent || existingContent
    let updatedBlock

    const updateInBuffer = options.useBuffer !== false

    if (content?.length > 0) {
      const updatedContent = content.map((block) => {
        if (block.id === options.blockId) {
          updatedBlock = {
            ...block,
            ...options.blockData
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

  const getSelectionInMarkdown = () => {
    const editor = getPlateEditorRef()
    if (!editor.selection) return

    const nodeFragments = editor.getFragment()
    const selectedText = parseToMarkdown({ children: nodeFragments, type: ELEMENT_PARAGRAPH })?.trim()

    return selectedText
  }

  const addBlockInContent = (noteId: string, block: BlockDataType) => {
    const bufferContent = useBufferStore.getState().getBuffer(noteId)
    const existingContent = useContentStore.getState().getContent(noteId)?.content

    const content = bufferContent || existingContent

    if (content?.length > 0) {
      const updatedContent = [...content, ...(block as any)]
      updateFromContent(noteId, updatedContent)
    }
  }

  return {
    insertInEditor,
    setInfoOfBlockInContent,
    addBlockInContent,
    getSelectionInMarkdown
  }
}

export default useUpdateBlock
