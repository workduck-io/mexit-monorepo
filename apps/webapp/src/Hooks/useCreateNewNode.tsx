import { getUntitledDraftKey, getUntitledKey } from '@mexit/core'
import toast from 'react-hot-toast'
import { useDataStore } from '../Stores/useDataStore'
import { useEditorStore } from '../Stores/useEditorStore'
import { useApi } from './useApi'
import useLoad from './useLoad'
import { useNavigation } from './useNavigation'

export const useCreateNewNode = () => {
  const addILink = useDataStore((s) => s.addILink)
  const { push } = useNavigation()
  const { saveNewNodeAPI } = useApi()
  const { saveNodeName } = useLoad()

  const createNewNode = (parent?: string) => {
    const newNodeId = parent !== undefined ? getUntitledKey(parent) : getUntitledDraftKey()
    const node = addILink({ ilink: newNodeId, showAlert: false })

    if (node === undefined) {
      toast.error('The node clashed')
      return
    }

    saveNodeName(useEditorStore.getState().node.nodeid)
    saveNewNodeAPI(node.nodeid)
    push(node.nodeid, { withLoading: false })

    return node.nodeid
  }

  return { createNewNode }
}
