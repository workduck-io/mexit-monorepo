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
import { useInternalLinks } from './useInternalLinks'
import { deserializeContent } from '../Utils/serializer'
import { useHighlightStore } from '../Stores/useHighlightStore'

export function useSaveChanges() {
  const workspaceDetails = useAuthStore((store) => store.workspaceDetails)
  const { node, setPreviewMode } = useEditorContext()
  const { ilinks, addILink, checkValidILink } = useDataStore()
  const { getParentILink, getEntirePathILinks, updateMultipleILinks, updateSingleILink, createNoteHierarchyString } =
    useInternalLinks()
  const { selection, setVisualState, setSelection, setActiveItem } = useSputlitContext()
  const { setContent, setMetadata } = useContentStore()
  const { dispatch } = useRaju()
  const addRecent = useRecentsStore((store) => store.addRecent)
  const { addHighlightedBlock } = useHighlightStore()

  const saveIt = (saveAndExit = false, notification = false) => {
    const state = platesStore.get.state()

    // Editor Id is different from nodeId
    // const editorId = getPlateId()
    const editorState = state[node.nodeid].get.value()

    const parentILink = getParentILink(node.path)
    const isRoot = node.path.split(SEPARATOR).length === 1

    const metadata = { saveableRange: selection?.range, sourceUrl: selection?.range && window.location.href }

    let request
    if (parentILink || isRoot) {
      updateSingleILink(node.nodeid, node.path)
      dispatch('ADD_SINGLE_ILINK', { nodeid: node.nodeid, path: node.path })
      request = {
        type: 'CAPTURE_HANDLER',
        subType: 'SAVE_NODE',
        data: {
          id: node.nodeid,
          title: node.title,
          content: editorState,
          referenceID: parentILink?.nodeid,
          workspaceID: workspaceDetails.id,
          metadata: metadata
        }
      }
    } else {
      const linksToBeCreated = getEntirePathILinks(node.path, node.nodeid)
      updateMultipleILinks(linksToBeCreated)
      dispatch('ADD_MULTIPLE_ILINKS', { linksToBeCreated: linksToBeCreated })
      request = {
        type: 'CAPTURE_HANDLER',
        subType: 'BULK_CREATE_NODES',
        data: {
          path: createNoteHierarchyString(node.path),
          id: node.nodeid,
          title: node.title,
          content: editorState,
          workspaceID: workspaceDetails.id,
          metadata: metadata
        }
      }
    }

    setContent(node.nodeid, editorState)

    setSelection(undefined)
    addRecent(node.nodeid)
    setActiveItem()

    if (notification) {
      toast.success('Saved')
    }

    chrome.runtime.sendMessage(request, (response) => {
      const { message, error } = response

      if (error && notification) {
        toast.error('An Error Occured. Please try again.')
      } else {
        const bulkCreateRequest = request.subType === 'BULK_CREATE_NODES'
        const nodeid = !bulkCreateRequest ? message.id : message.node.id
        const content = deserializeContent(!bulkCreateRequest ? message.data : message.node.data)
        const metadata = extractMetadata(!bulkCreateRequest ? message : message.node)
        // setMetadata(message.id, metadata)
        // console.log('message', message)
        // setContent(node.nodeid, deserializeContent(message.data))

        dispatch('SET_CONTENT', {
          nodeid,
          content,
          metadata
        })

        addHighlightedBlock(nodeid, content, window.location.href)

        // mog('deserialized content from backend', {
        //   content: deserializeContent(!bulkCreateRequest ? message.data : message.node.data)
        // })

        if (notification) {
          toast.success('Saved to Cloud')
        }

        if (saveAndExit) {
          setVisualState(VisualState.animatingOut)
          // So that sputlit opens with preview true when it opens the next time
          setPreviewMode(true)
        }
      }
    })
  }

  return {
    saveIt
  }
}
