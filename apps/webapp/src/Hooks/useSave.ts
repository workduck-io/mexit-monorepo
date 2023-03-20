import { mog } from '@mexit/core'

import { useContentStore } from '../Stores/useContentStore'

import { useApi } from './API/useNodeAPI'

interface SaveEditorValueOptions {
  // If not set, defaults to true
  saveApi?: boolean

  // Defaults to false
  isShared?: boolean
}

export const useDataSaverFromContent = () => {
  const setInternalUpdate = useContentStore((state) => state.setInternalUpdate)
  const getContent = useContentStore((state) => state.getContent)

  const { saveDataAPI } = useApi()

  // By default saves to API use false to not save
  const saveEditorValueAndUpdateStores = async (
    nodeId: string,
    namespace: string,
    editorValue: any[],
    options?: SaveEditorValueOptions
  ) => {
    if (editorValue) {
      mog('saveEditorValueAndUpdateStores', { nodeId, editorValue, options })

      setInternalUpdate(true)
      if (options?.saveApi !== false) await saveDataAPI(nodeId, namespace, editorValue, options?.isShared ?? false)
    }
  }

  const saveNodeAPIandFs = (nodeId: string, namespace: string) => {
    const content = getContent(nodeId)
    mog('saving to api for nodeId: ', { nodeId, content })
    saveDataAPI(nodeId, namespace, content.content)
  }

  return { saveEditorValueAndUpdateStores, saveNodeAPIandFs }
}
