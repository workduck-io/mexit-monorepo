import { getPlateId, platesStore } from '@udecode/plate'
import { CaptureType, extractMetadata, mog, NodeProperties, SEPARATOR } from '@mexit/core'
import { useContentStore } from '../Stores/useContentStore'
import useDataStore from '../Stores/useDataStore'
import { useSputlitContext, VisualState } from './useSputlitContext'
import toast from 'react-hot-toast'
import { useAuthStore } from './useAuth'
import { useEditorContext } from './useEditorContext'
import useRaju from './useRaju'
import { useRecentsStore } from '../Stores/useRecentsStore'

export function useSaveChanges() {
  const workspaceDetails = useAuthStore((store) => store.workspaceDetails)
  const { node } = useEditorContext()
  const { ilinks, addILink } = useDataStore()
  const { selection, setVisualState, setSelection } = useSputlitContext()
  const { setContent, setMetadata } = useContentStore()
  const { dispatch } = useRaju()
  const addRecent = useRecentsStore((store) => store.addRecent)

  const saveIt = (saveAndExit = false, notification = false) => {
    const state = platesStore.get.state()

    // Editor Id is different from nodeId
    const editorId = getPlateId()
    const editorState = state[editorId].get.value()

    // mog('editorState', { editorState })

    const metadata = {
      saveableRange: selection?.range,
      sourceUrl: selection?.range && window.location.href
    }

    const splitPath = node.path.split(SEPARATOR)
    const request = {
      type: 'CAPTURE_HANDLER',
      subType: 'BULK_CREATE_NODE',
      data: {
        id: node.nodeid,
        content: editorState,
        title: splitPath.slice(-1)[0],
        type: CaptureType.DRAFT,
        workspaceID: workspaceDetails.id,
        metadata: metadata
      }
    }

    if (splitPath.length > 1) {
      const parent = splitPath.slice(0, -1).join(SEPARATOR)
      const parentID = ilinks.find((i) => i.path === parent)
      request.data['referenceID'] = parentID.nodeid
    }

    // console.log('Sending: ', node, request)

    setContent(node.nodeid, editorState)
    setSelection(undefined)
    if (!ilinks.map((l) => l.path).includes(node.path)) {
      addILink({ ilink: node.path, nodeid: node.nodeid })
    }
    addRecent(node.nodeid)
    if (notification) {
      toast.success('Saved')
    }

    chrome.runtime.sendMessage(request, (response) => {
      const { message, error } = response

      if (error && notification) {
        toast.error('An Error Occured. Please try again.')
      } else {
        setMetadata(message.id, extractMetadata(message.data[0]))

        dispatch('SET_CONTENT', {
          nodeid: node.nodeid,
          content: editorState,
          metadata: extractMetadata(message.data[0])
        })
        if (!ilinks.map((l) => l.path).includes(node.path)) {
          dispatch('ADD_ILINK', { ilink: node.path, nodeid: node.nodeid })
        }

        if (notification) {
          toast.success('Saved to Cloud')
        }

        if (saveAndExit) {
          setVisualState(VisualState.hidden)
        }
      }
    })
  }

  return {
    saveIt
  }
}
