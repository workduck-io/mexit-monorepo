import { findNodePath, getPlateEditorRef, setNodes } from "@udecode/plate"
import { useBufferStore } from "../../Hooks/useEditorBuffer"
import { useContentStore } from "../../Stores/useContentStore"

type BlockDataType = Record<string, any>

const useUpdateBlock = () => {
  const addInBuffer = useBufferStore(b => b.add)

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
  const setInfoOfBlockInContent = (noteId: string, options: {
    blockId: string,
    blockData: BlockDataType,
    useBuffer: boolean
  }) => {
    const content = useContentStore.getState().getContent(noteId)?.content
    const updateInBuffer = options.useBuffer !== false

    if (content) {
      const updatedContent = content.map(block => {
        if (block.id === options.blockId) return {
          ...block,
          ...options.blockData
        }

        return block
      })

      if (updateInBuffer) {
        addInBuffer(noteId, updatedContent)

        return
      }
    }
  }


  return {
    insertInEditor,
    setInfoOfBlockInContent
  }
}

export default useUpdateBlock 
