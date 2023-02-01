import { toast } from 'react-hot-toast'

import {
  checkIfUntitledDraftNode,
  DRAFT_PREFIX,
  ELEMENT_PARAGRAPH,
  getAllParentIds,
  getParentNodePath,
  ILink,
  mog,
  NodeEditorContent,
  NodeProperties,
  SEPARATOR,
  updateEmptyBlockTypes
} from '@mexit/core'

import { useAnalysisStore } from '../Stores/useAnalysis'
import { useAuthStore } from '../Stores/useAuth'
import { useContentStore } from '../Stores/useContentStore'
import { useDataStore } from '../Stores/useDataStore'
import { getContent, useEditorStore } from '../Stores/useEditorStore'
import { useBlockHighlightStore } from '../Stores/useFocusBlock'
import { useLayoutStore } from '../Stores/useLayoutStore'
import { useUserPreferenceStore } from '../Stores/userPreferenceStore'
import { useTreeStore } from '../Stores/useTreeStore'

import { useApi } from './API/useNodeAPI'
import { useComments } from './useComments'
import { useBufferStore, useEditorBuffer } from './useEditorBuffer'
import { useFetchShareData } from './useFetchShareData'
import { useLastOpened } from './useLastOpened'
import { getLinkFromNodeIdHookless } from './useLinks'
import { useReactions } from './useReactions'
import { useRefactor } from './useRefactor'
import useToggleElements from './useToggleElements'

export interface LoadNodeOptions {
  savePrev?: boolean
  fetch?: boolean
  node?: NodeProperties
  withLoading?: boolean
  // Highlights the block after loading
  highlightBlockId?: string
}

export interface IsLocalType {
  isLocal: boolean
  ilink?: ILink
  isShared: boolean
}

export type LoadNodeFn = (nodeid: string, options?: LoadNodeOptions) => void

const useLoad = () => {
  const loadNodeEditor = useEditorStore((store) => store.loadNode)
  const setFetchingContent = useEditorStore((store) => store.setFetchingContent)
  const setContent = useContentStore((store) => store.setContent)
  // const setNodePreview = useGraphStore((store) => store.setNodePreview)
  const { getDataAPI, saveDataAPI } = useApi()
  const { getAllCommentsOfNode } = useComments()
  const { getAllReactionsOfNode } = useReactions()
  // const setSuggestions = useSuggestionStore((store) => store.setSuggestions)
  const { toggleSuggestedNodes } = useToggleElements()
  const infobar = useLayoutStore((store) => store.infobar)
  const setHighlights = useBlockHighlightStore((store) => store.setHighlightedBlockIds)
  const { fetchSharedUsers } = useFetchShareData()
  const { debouncedAddLastOpened } = useLastOpened()
  const changeSpace = useUserPreferenceStore((store) => store.setActiveNamespace)

  const setLoadingNodeid = useEditorStore((store) => store.setLoadingNodeid)
  // const { push } = useNavigation()
  // const clearLoadingNodeid = useEditorStore((store) => store.clearLoadingNodeid)
  const expandNodes = useTreeStore((store) => store.expandNodes)

  // const quitFullscreenGraph = useGraphStore((store) => store.quitFullscreen)

  // const { saveNodeAPIandFs } = useDataSaverFromContent()
  const { saveAndClearBuffer } = useEditorBuffer()
  const { execRefactorAsync } = useRefactor()
  // const { saveQ } = useSaveQ()

  const saveNodeName = (nodeId: string, title?: string) => {
    if (nodeId !== useAnalysisStore.getState().analysis?.nodeid) return
    const draftNodeTitle = title ?? useAnalysisStore.getState().analysis?.title
    mog('SAVE NODE NAME', { draftNodeTitle })
    if (!draftNodeTitle) return

    const node = getLinkFromNodeIdHookless(nodeId)
    const { path: nodePath, namespace } = node
    const isUntitled = checkIfUntitledDraftNode(nodePath)

    if (!isUntitled) return

    const parentNodePath = getParentNodePath(nodePath)
    const newNodePath = `${parentNodePath}.${draftNodeTitle}`

    if (newNodePath !== nodePath)
      try {
        execRefactorAsync(
          {
            path: nodePath,
            namespaceID: namespace
          },
          {
            path: newNodePath,
            namespaceID: namespace
          },
          false
        )

        loadNode(nodeId, { fetch: false })
      } catch (err) {
        toast('Unable to rename node')
      }

    return newNodePath
  }

  const getNode = (nodeid: string): NodeProperties => {
    const ilinks = useDataStore.getState().ilinks
    const archive = useDataStore.getState().archive
    const sharedNodes = useDataStore.getState().sharedNodes

    const archiveLink = archive.find((i) => i.nodeid === nodeid)
    const respectiveLink = ilinks.find((i) => i.nodeid === nodeid)
    const sharedLink = sharedNodes.find((i) => i.nodeid === nodeid)

    const UID = respectiveLink?.nodeid ?? archiveLink?.nodeid ?? sharedLink?.nodeid ?? nodeid
    const text = respectiveLink?.path ?? archiveLink?.path ?? sharedLink?.path
    const namespace = respectiveLink?.namespace ?? archiveLink?.namespace ?? sharedLink?.namespace

    const node = {
      title: text,
      id: text,
      nodeid: UID,
      path: text,
      namespace
    }

    return node
  }

  const isLocalNode = (nodeid: string): IsLocalType => {
    const ilinks = useDataStore.getState().ilinks
    const archive = useDataStore.getState().archive
    const sharedNodes = useDataStore.getState().sharedNodes

    const node = getNode(nodeid)

    const inIlinks = ilinks.find((i) => i.nodeid === nodeid)
    const inArchive = archive.find((i) => i.nodeid === nodeid)
    const inShared = sharedNodes.find((i) => i.nodeid === nodeid)

    const isDraftNode = node && node.path?.startsWith(`${DRAFT_PREFIX}${SEPARATOR}`)

    const res = {
      isLocal: !!inIlinks || !!inArchive || !!isDraftNode,
      isShared: !!inShared,
      ilink: inIlinks ?? inArchive
    }

    return res
  }

  /*
   * Saves content of a node to api and then uses
   * the response to update the content from server in local state
   */
  const saveApiAndUpdate = (node: NodeProperties, content: NodeEditorContent) => {
    const sharedNodes = useDataStore.getState().sharedNodes
    const isShared = !!sharedNodes.find((i) => i.nodeid === node.nodeid)
    setFetchingContent(true)
    saveDataAPI(node.nodeid, node.namespace, content, isShared)
      .then((data) => {
        if (data) {
          // const { data, metadata, version } = res
          // goTo(ROUTE_PATHS.node, NavigationType.replace, node.nodeid)
          // mog('SAVED DATA', { data })
          // if (data) {
          //   updateEmptyBlockTypes(data, ELEMENT_PARAGRAPH)
          //   const nodeContent = {
          //     type: 'editor',
          //     content: data,
          //     version,
          //     metadata
          //   }
          // loadNodeAndReplaceContent(node, nodeContent)
          //   setContent(node.nodeid, data, metadata)
          // setFetchingContent(false)
          // }
        }
      })
      .catch(console.error)
      .finally(() => setFetchingContent(false))
    // if (isShared) {
    fetchSharedUsers(node.nodeid, 'note')
    // }
  }

  /*
   * Fetches the node and saves it to local state
   * Should be used when current editor content is irrelevant to the node
   */
  const fetchAndSaveNode = async (node: NodeProperties, options = { withLoading: true, isShared: false }) => {
    // console.log('Fetch and save', { node })
    // const node = getNode(nodeid)
    if (options.withLoading) setFetchingContent(true)

    getDataAPI(node.nodeid, options.isShared)
      .then((nodeData) => {
        if (nodeData) {
          const { content, metadata, version } = nodeData

          if (content) {
            updateEmptyBlockTypes(content, ELEMENT_PARAGRAPH)

            // mog('Fetch and load data', { data, metadata, version })
            const loadingNodeid = useEditorStore.getState().loadingNodeid

            setContent(node.nodeid, content, metadata)
            if (node.nodeid === loadingNodeid) {
              loadNodeEditor(node)
            } else {
              mog('CurrentNode is not same for loadNode', { node, loadingNodeid })
            }
          }
        }
        if (options.withLoading) setFetchingContent(false)
      })
      .catch((e) => {
        console.error(e)
      })
      .finally(() => {
        if (options.withLoading) setFetchingContent(false)
      })
  }

  /**
   * Loads a node in the editor.
   * This does not navigate to editor.
   *
   * For shared:
   * fetchAndSave different
   */
  const loadNode: LoadNodeFn = (nodeid, options = { savePrev: true, fetch: true, withLoading: true }) => {
    // mog('Load Node Called', { nodeid, options })
    const hasBeenLoaded = false
    const currentNodeId = useEditorStore.getState().node.nodeid
    const isAuthenticated = useAuthStore.getState().authenticated

    if (!isAuthenticated) return

    const localCheck = isLocalNode(nodeid)

    if (!options.node && !localCheck.isLocal && !localCheck.isShared) {
      toast.error('Selected note does not exist.')
      nodeid = currentNodeId
    }

    setLoadingNodeid(nodeid)

    // quitFullscreenGraph()
    // setNodePreview(false)
    // setSuggestions([])
    if (infobar.mode === 'suggestions') toggleSuggestedNodes()

    // setSelectedNode(undefined)

    if (options.savePrev) {
      saveNodeName(currentNodeId)
      saveAndClearBuffer(false)
    }

    const node = options.node ?? getNode(nodeid)

    if (options.fetch && !hasBeenLoaded) {
      mog('Fetching')
      if (localCheck.isShared) {
        // TODO: Change fetch for shared
        fetchAndSaveNode(node, { withLoading: true, isShared: true })
      } else fetchAndSaveNode(node, { withLoading: true, isShared: false })
      getAllCommentsOfNode(nodeid)
      getAllReactionsOfNode(nodeid)
    }

    fetchSharedUsers(node.nodeid, 'note')

    if (options.highlightBlockId) {
      setHighlights([options.highlightBlockId], 'editor')
    }

    if (!localCheck.isShared && node.path) {
      const allParents = getAllParentIds(node.path)
      expandNodes(allParents)
    }

    debouncedAddLastOpened(nodeid)

    mog('Loading that here', { node })
    changeSpace(node.namespace)
    loadNodeEditor(node)
  }

  const loadNodeProps = (nodeProps: NodeProperties) => {
    loadNodeEditor(nodeProps)
  }

  const getNoteContent = (noteId: string) => {
    const buffer = useBufferStore.getState().buffer?.[noteId] || getContent(noteId)?.content
    return buffer
  }

  const loadNodeAndAppend = async (nodeid: string, content: NodeEditorContent) => {
    const nodeProps = getNode(nodeid)
    const nodeContent = getContent(nodeid)

    const appendedContent = [...nodeContent.content, ...content]
    mog('Appended content', { appendedContent })
    setContent(nodeid, appendedContent)

    loadNodeEditor(nodeProps)
  }

  return {
    loadNode,
    fetchAndSaveNode,
    saveNodeName,
    loadNodeAndAppend,
    isLocalNode,
    loadNodeProps,
    getNode,
    getNoteContent,
    saveApiAndUpdate
  }
}

export default useLoad
