import { mog, useBufferStore, useContentStore } from '@mexit/core'
import useUpdateBlock from '../Editor/Hooks/useUpdateBlock'
import { useApi } from '../Hooks/API/useNodeAPI'

export const emitterHandler = async (result) => {
  mog('Callback Property Handler Result', { result })
  const { appendToNode } = useApi()
  const { addBlockInContent } = useUpdateBlock()
  const clearBuffer = useBufferStore((s) => s.remove)
  const setInternalUpdate = useContentStore((s) => s.setInternalUpdate)

  if (result && result.length && result[0]?.noteId)
    appendToNode(
      result[0]?.noteId,
      result.map((item) => item.block)
    ).then(() => {
      //TODO: Generic handler for property update events
      addBlockInContent(
        result[0]?.noteId,
        result.map((item) => item.block)
      )
      clearBuffer(result[0]?.noteId)
      setInternalUpdate(true)
    })
}
