import toast from 'react-hot-toast'

import { defaultContent, extractMetadata, ILink, mog, SEPARATOR } from '@mexit/core'

import { useContentStore } from '../Stores/useContentStore'
import useDataStore from '../Stores/useDataStore'
import { useHighlightStore } from '../Stores/useHighlightStore'
import { useRecentsStore } from '../Stores/useRecentsStore'
import { useSputlitStore } from '../Stores/useSputlitStore'
import { deserializeContent, serializeContent } from '../Utils/serializer'
import { useAuthStore } from './useAuth'
import { useEditorStore } from './useEditorStore'
import { useInternalLinks } from './useInternalLinks'
import { getTitleFromPath } from './useLinks'
import { useNamespaces } from './useNamespaces'
import { useNodes } from './useNodes'
import useRaju from './useRaju'
import { useSputlitContext, VisualState } from './useSputlitContext'

export interface AppendAndSaveProps {
  nodeid: string
  content: any[]
  saveAndExit?: boolean
  notification?: boolean
}

export function useSaveChanges() {
  const workspaceDetails = useAuthStore((store) => store.workspaceDetails)
  const { setPreviewMode, setNodeContent } = useEditorStore()
  const { getParentILink, getEntirePathILinks, updateMultipleILinks, updateSingleILink, createNoteHierarchyString } =
    useInternalLinks()
  const { setVisualState } = useSputlitContext()
  const setNode = useSputlitStore((s) => s.setNode)
  const setSelection = useSputlitStore((s) => s.setSelection)

  const setActiveItem = useSputlitStore((s) => s.setActiveItem)
  const { ilinks, sharedNodes } = useDataStore()
  const { getContent, setContent } = useContentStore()
  const { dispatch } = useRaju()
  const addRecent = useRecentsStore((store) => store.addRecent)
  const { addHighlightedBlock } = useHighlightStore()
  const { isSharedNode } = useNodes()
  const { getDefaultNamespace, getNamespaceOfNodeid } = useNamespaces()

  const saveIt = (saveAndExit = false, notification = false) => {
    setVisualState(VisualState.animatingOut)
    const node = useSputlitStore.getState().node
    const namespace = getNamespaceOfNodeid(node?.nodeid) ?? getDefaultNamespace()

    const selection = useSputlitStore.getState().selection

    // Editor Id is different from nodeId
    // const editorId = getPlateId()
    const editorState = useEditorStore.getState().nodeContent

    // mog('nodeContent', editorState)

    const parentILink = getParentILink(node.path)
    const isRoot = node.path.split(SEPARATOR).length === 1

    const metadata = { saveableRange: selection?.range, sourceUrl: selection?.range && window.location.href }

    let request
    if (parentILink || isRoot) {
      if (!isSharedNode(node.nodeid)) {
        updateSingleILink(node.nodeid, node.path, namespace.id)
      }

      dispatch('ADD_SINGLE_ILINK', node.nodeid, node.path, namespace.id)

      request = {
        type: 'CAPTURE_HANDLER',
        subType: 'SAVE_NODE',
        data: {
          id: node.nodeid,
          title: node.title,
          content: editorState,
          referenceID: parentILink?.nodeid,
          workspaceID: workspaceDetails.id,
          namespaceID: namespace.id,
          metadata: metadata
        }
      }
    } else {
      const linksToBeCreated = getEntirePathILinks(node.path, node.nodeid, namespace.id)
      updateMultipleILinks(linksToBeCreated)
      dispatch('ADD_MULTIPLE_ILINKS', linksToBeCreated)
      request = {
        type: 'CAPTURE_HANDLER',
        subType: 'BULK_CREATE_NODES',
        data: {
          path: createNoteHierarchyString(node.path, namespace.id),
          id: node.nodeid,
          title: node.title,
          content: editorState,
          workspaceID: workspaceDetails.id,
          namespaceID: namespace.id,
          metadata: metadata
        }
      }
    }

    setContent(node.nodeid, editorState)

    setSelection(undefined)
    addRecent(node.nodeid)
    setActiveItem()

    // if (notification) {
    //   toast.success('Saved')
    // }

    // mog('Request and things', { request, node, nodeContent, editorState })
    chrome.runtime.sendMessage(request, (response) => {
      const { message, error } = response

      if (error && notification) {
        toast.error('An Error Occured. Please try again.')
      } else {
        const bulkCreateRequest = request.subType === 'BULK_CREATE_NODES'
        const nodeid = !bulkCreateRequest ? message.id : message.node.id
        const content = deserializeContent(!bulkCreateRequest ? message.data : message.node.data)
        const metadata = extractMetadata(!bulkCreateRequest ? message : message.node)

        dispatch('ADD_RECENT_NODE', nodeid)

        dispatch('SET_CONTENT', nodeid, content, metadata)

        addHighlightedBlock(nodeid, content)
        dispatch('ADD_HIGHLIGHTED_BLOCK', nodeid, content)

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

  const appendAndSave = ({ nodeid, content: toAppendContent, saveAndExit, notification }: AppendAndSaveProps) => {
    const node = isSharedNode(nodeid)
      ? sharedNodes.find((i) => i.nodeid === nodeid)
      : ilinks.find((i) => i.nodeid === nodeid)

    const namespace = getNamespaceOfNodeid(node.nodeid)

    setNode({
      id: node.nodeid,
      title: node.path.split(SEPARATOR).slice(-1)[0],
      path: node.path,
      nodeid: node.nodeid,
      namespace: namespace.id
    })
    const storeContent = getContent(node?.nodeid)?.content ?? defaultContent.content
    mog('We be setting persistedContent', { toAppendContent, storeContent })
    const content = [...storeContent, ...toAppendContent]
    // setNodeContent([...storeContent, ...content])
    const request = {
      type: 'CAPTURE_HANDLER',
      subType: 'SAVE_NODE',
      data: {
        id: node.nodeid,
        title: getTitleFromPath(node.path),
        content,
        workspaceID: workspaceDetails.id,
        namespaceID: namespace.id,
        metadata: {}
      }
    }

    setContent(node.nodeid, content)

    setSelection(undefined)
    addRecent(node.nodeid)
    setActiveItem()
    // mog('Request and things', { request, node, nodeContent, content })
    // TODO: Merge this with the savit request call. DRY
    chrome.runtime.sendMessage(request, (response) => {
      const { message, error } = response

      if (error && notification) {
        toast.error('An Error Occured. Please try again.')
      } else {
        // mog('Response and things', { response })
        const bulkCreateRequest = request.subType === 'BULK_CREATE_NODES'
        const nodeid = !bulkCreateRequest ? message.id : message.node.id
        const content = deserializeContent(!bulkCreateRequest ? message.data : message.node.data)
        const metadata = extractMetadata(!bulkCreateRequest ? message : message.node)

        dispatch('ADD_RECENT_NODE', nodeid)

        dispatch('SET_CONTENT', nodeid, content, metadata)

        if (notification) {
          toast.success('Saved to Cloud')
        }

        if (saveAndExit) {
          mog('Save and exit NOW')
          setVisualState(VisualState.animatingOut)
          // So that sputlit opens with preview true when it opens the next time
          setPreviewMode(true)
        }
      }
    })
  }

  return {
    saveIt,
    appendAndSave
  }
}
