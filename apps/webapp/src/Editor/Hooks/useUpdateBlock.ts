import { useUpdateBlockHook } from '@mexit/shared'

import { useUpdater } from '../../Hooks/useUpdater'

const useUpdateBlock = () => {
  const { updateFromContent } = useUpdater()
  const updaterFunctions = useUpdateBlockHook()

  const addBlockInContent = (noteId: string, block: Record<string, any>, type?: 'add' | 'delete') => {
    const content = updaterFunctions.getNoteContent(noteId)

    if (content?.length > 0) {
      const updatedContent =
        type === 'delete' ? content.filter((b) => b.id !== block.id) : [...content, ...(block as any)]
      updateFromContent(noteId, updatedContent)
    }
  }

  return {
    ...updaterFunctions,
    addBlockInContent
  }
}

export default useUpdateBlock
