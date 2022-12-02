import toast from 'react-hot-toast'

import {
  defaultContent,
  extractMetadata,
  generateHighlightId,
  getHighlightBlockMap,
  Highlight,
  mog,
  NodeProperties,
  SEPARATOR,
  SingleNamespace
} from '@mexit/core'

import { useContentStore } from '../Stores/useContentStore'
import useDataStore from '../Stores/useDataStore'
import { useHighlightStore } from '../Stores/useHighlightStore'
import { useRecentsStore } from '../Stores/useRecentsStore'
import { useSputlitStore } from '../Stores/useSputlitStore'
import { deserializeContent } from '../Utils/serializer'

import { useAuthStore } from './useAuth'
import { useEditorStore } from './useEditorStore'
import { useHighlights } from './useHighlights'
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
  const { addHighlight } = useHighlightStore()
  const { isSharedNode } = useNodes()
  const { getDefaultNamespace, getNamespaceOfNodeid } = useNamespaces()
  const { saveHighlight } = useHighlights()

  /**
   * Save
   */
  const saveIt = async (saveAndExit = false, notification = false) => {
    // mog('saveIt', { saveAndExit, notification })
    setVisualState(VisualState.animatingOut)

    const node = useSputlitStore.getState().node
    const namespace = getNamespaceOfNodeid(node?.nodeid) ?? getDefaultNamespace()
    const selection = useSputlitStore.getState().selection
    const editorState = useEditorStore.getState().nodeContent
    // mog('nodeContent', editorState)

    const parentILink = getParentILink(node.path)
    const isRoot = node.path.split(SEPARATOR).length === 1
    const isSingle = !!parentILink || isRoot

    dispatchLinkUpdates(node, namespace, isSingle)

    const request = {
      type: 'CAPTURE_HANDLER',
      subType: isSingle ? 'SAVE_NODE' : 'BULK_CREATE_NODES',
      data: {
        path: isSingle ? undefined : createNoteHierarchyString(node.path, namespace.id),
        id: node.nodeid,
        title: node.title,
        content: editorState,
        referenceID: isSingle ? undefined : parentILink?.nodeid,
        workspaceID: workspaceDetails.id,
        namespaceID: namespace.id,
        highlightId: undefined
      }
    }

    mog('request', { request })

    setContent(node.nodeid, editorState)

    setSelection(undefined)
    addRecent(node.nodeid)
    setActiveItem()

    const { highlight, blockHighlightMap } = await createHighlightEntityFromSelection(
      selection,
      node.nodeid,
      editorState
    )
    if (highlight) {
      request.data.highlightId = highlight.entityId
    }

    mog('Request and things', { request, node, editorState, highlight })
    chrome.runtime.sendMessage(request, (response) => {
      const { message, error } = response
      // mog('Response', { response })

      if (error && notification) {
        toast.error('An Error Occured. Please try again.')
      } else {
        const bulkCreateRequest = request.subType === 'BULK_CREATE_NODES'

        const nodeid = !bulkCreateRequest ? message.id : message.node.id
        const content = deserializeContent(!bulkCreateRequest ? message.data : message.node.data)
        const metadata = extractMetadata(!bulkCreateRequest ? message : message.node)

        mog('DispatchAfterSave', { response, nodeid, content, metadata, highlight, blockHighlightMap })
        dispatchAfterSave({ nodeid, content, metadata, highlight, blockHighlightMap }, saveAndExit, notification)
      }
    })
  }

  /**
   * Creates highlight entity from selection
   * Does not add the highlight to the store as that requires content to generate blockmap
   *
   * @param selection
   * @returns Highlight
   */
  const createHighlightEntityFromSelection = async (selection: any, nodeid: string, content: any[]) => {
    const isCapturedHighlight = selection?.range && window.location.href
    const highlight = isCapturedHighlight && {
      entityId: generateHighlightId(),
      properties: {
        sourceUrl: selection?.range && window.location.href,
        saveableRange: selection?.range
      }
    }
    if (highlight) {
      // Save highlight
      const sourceTitle = document.title
      await saveHighlight(highlight, sourceTitle)
      // Extract the blockids for which we have captured highlights
      const blockHighlightMap = getHighlightBlockMap(nodeid, content)
      // Add highlight in local store and nodeblockmap
      addHighlight(highlight, blockHighlightMap)
      return { highlight, blockHighlightMap }
    }
    return { highlight: undefined, blockHighlightMap: undefined }
  }

  const dispatchLinkUpdates = (node: NodeProperties, namespace: SingleNamespace, isSingle: boolean) => {
    if (isSingle) {
      if (!isSharedNode(node.nodeid)) {
        updateSingleILink(node.nodeid, node.path, namespace.id)
      }
      dispatch('ADD_SINGLE_ILINK', node.nodeid, node.path, namespace.id)
    } else {
      const linksToBeCreated = getEntirePathILinks(node.path, node.nodeid, namespace.id)
      // Why is shared check not used here?
      updateMultipleILinks(linksToBeCreated)
      dispatch('ADD_MULTIPLE_ILINKS', linksToBeCreated)
    }
  }

  interface DispatchData {
    nodeid: string
    content: any[]
    metadata: any
    highlight?: Highlight
    blockHighlightMap?: {
      nodeId: string
      blockIds: string[]
    }
  }
  // Dispatches new items to the stores
  const dispatchAfterSave = (
    { nodeid, content, metadata, highlight, blockHighlightMap }: DispatchData,
    saveAndExit = false,
    notification = false
  ) => {
    dispatch('ADD_RECENT_NODE', nodeid)
    dispatch('SET_CONTENT', nodeid, content, metadata)
    if (highlight) dispatch('ADD_HIGHLIGHTED_BLOCK', highlight, blockHighlightMap)

    if (notification) {
      toast.success('Saved to Cloud')
    }

    if (saveAndExit) {
      setVisualState(VisualState.animatingOut)
      // So that sputlit opens with preview true when it opens the next time
      setPreviewMode(true)
    }
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
