import {
  NodeEditorContent,
  NodeProperties,
  ILink,
  DRAFT_PREFIX,
  mog,
  ELEMENT_PARAGRAPH,
  SEPARATOR,
  updateEmptyBlockTypes
} from '@mexit/core'
import { getParentId } from '@mexit/shared'
import { toast } from 'react-hot-toast'

import { useApi } from './useApi'
import { useEditorBuffer } from './useEditorBuffer'
import { useAnalysisStore } from '../Stores/useAnalysis'
import { useRefactor } from './useRefactor'
import { checkIfUntitledDraftNode } from '@mexit/core'
import { useBlockHighlightStore } from '../Stores/useFocusBlock'
import { useContentStore } from '../Stores/useContentStore'
import { useDataStore } from '../Stores/useDataStore'
import { useEditorStore, getContent } from '../Stores/useEditorStore'
import { getPathFromNodeIdHookless } from './useLinks'

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
}

export type LoadNodeFn = (nodeid: string, options?: LoadNodeOptions) => void

const useLoad = () => {
  const loadNodeEditor = useEditorStore((store) => store.loadNode)
  const loadNodeAndReplaceContent = useEditorStore((store) => store.loadNodeAndReplaceContent)
  const setFetchingContent = useEditorStore((store) => store.setFetchingContent)
  const setContent = useContentStore((store) => store.setContent)
  const { getDataAPI, saveDataAPI } = useApi()
  const setHighlights = useBlockHighlightStore((store) => store.setHighlightedBlockIds)

  const setLoadingNodeid = useEditorStore((store) => store.setLoadingNodeid)
  const { saveAndClearBuffer } = useEditorBuffer()
  const { execRefactor } = useRefactor()

  const saveNodeName = (nodeId: string, title?: string) => {
    const draftNodeTitle = title ?? useAnalysisStore.getState().analysis.title
    mog('SAVE NODE NAME', { draftNodeTitle })
    if (!draftNodeTitle) return

    const nodePath = getPathFromNodeIdHookless(nodeId)
    const isUntitled = checkIfUntitledDraftNode(nodePath)

    if (!isUntitled) return

    const parentNodePath = getParentId(nodePath)
    const newNodePath = `${parentNodePath}.${draftNodeTitle}`

    if (newNodePath !== nodePath)
      try {
        execRefactor(nodePath, newNodePath, false)
        loadNode(nodeId, { fetch: false })
      } catch (err) {
        toast('Unable to rename node')
      }
  }

  const getNode = (nodeid: string): NodeProperties => {
    const ilinks = useDataStore.getState().ilinks
    const archive = useDataStore.getState().archive

    const archiveLink = archive.find((i) => i.nodeid === nodeid)
    const respectiveLink = ilinks.find((i) => i.nodeid === nodeid)

    const UID = respectiveLink?.nodeid ?? archiveLink?.nodeid ?? nodeid
    const text = respectiveLink?.path ?? archiveLink?.path

    const node = {
      title: text,
      id: text,
      nodeid: UID,
      path: text
    }

    return node
  }

  const isLocalNode = (nodeid: string): IsLocalType => {
    const ilinks = useDataStore.getState().ilinks
    const archive = useDataStore.getState().archive

    const node = getNode(nodeid)

    const inIlinks = ilinks.find((i) => i.nodeid === nodeid)
    const inArchive = archive.find((i) => i.nodeid === nodeid)

    const isDraftNode = node && node.path?.startsWith(`${DRAFT_PREFIX}${SEPARATOR}`)

    const res = {
      isLocal: !!inIlinks || !!inArchive || !!isDraftNode,
      ilink: inIlinks ?? inArchive
    }

    return res
  }

  /*
   * Saves content of a node to api and then uses
   * the response to update the content from server in local state
   */
  const saveApiAndUpdate = (node: NodeProperties, content: NodeEditorContent) => {
    setFetchingContent(true)
    saveDataAPI(node.nodeid, content)
      .then((data) => {
        if (data) {
          mog('SAVED DATA', { data })
        }
      })
      .catch(console.error)
      .finally(() => setFetchingContent(false))
  }

  /*
   * Fetches the node and saves it to local state
   * Should be used when current editor content is irrelevant to the node
   */
  const fetchAndSaveNode = async (node: NodeProperties, withLoading = true) => {
    // console.log('Fetch and save', { node })
    // const node = getNode(nodeid)
    if (withLoading) setFetchingContent(true)
    getDataAPI(node.nodeid)
      .then((nodeData) => {
        if (nodeData) {
          // console.log(res)
          const { content, metadata, version } = nodeData

          if (content) {
            updateEmptyBlockTypes(content, ELEMENT_PARAGRAPH)
            const nodeContent = {
              type: 'editor',
              content,
              version,
              metadata
            }

            // mog('Fetch and load data', { data, metadata, version })
            const loadingNodeid = useEditorStore.getState().loadingNodeid

            if (node.nodeid === loadingNodeid) {
              loadNodeAndReplaceContent(node, nodeContent)
            } else {
              mog('CurrentNode is not same for loadNode', { node, loadingNodeid })
            }
            setContent(node.nodeid, content, metadata)
          }
        }
        if (withLoading) setFetchingContent(false)
      })
      .catch((e) => {
        console.error(e)
      })
      .finally(() => {
        if (withLoading) setFetchingContent(false)
      })
  }

  /**
   * Loads a node in the editor.
   * This does not navigate to editor.
   */
  const loadNode: LoadNodeFn = (nodeid, options = { savePrev: true, fetch: true, withLoading: true }) => {
    const hasBeenLoaded = false
    const currentNodeId = useEditorStore.getState().node.nodeid

    if (!options.node && !isLocalNode(nodeid).isLocal) {
      toast.error('Selected node does not exist.')
      nodeid = currentNodeId
    }

    setLoadingNodeid(nodeid)

    if (options.savePrev) {
      saveNodeName(currentNodeId)
      saveAndClearBuffer()
    }

    const node = options.node ?? getNode(nodeid)

    if (options.fetch && !hasBeenLoaded) {
      fetchAndSaveNode(node, options.withLoading)
    }
    if (options.highlightBlockId) {
      setHighlights([options.highlightBlockId], 'editor')
    }

    loadNodeEditor(node)
  }

  const loadNodeProps = (nodeProps: NodeProperties) => {
    loadNodeEditor(nodeProps)
  }

  const loadNodeAndAppend = async (nodeid: string, content: NodeEditorContent) => {
    const nodeProps = getNode(nodeid)
    const nodeContent = getContent(nodeid)

    const appendedContent = [...nodeContent.content, ...content]
    mog('Appended content', { appendedContent })

    loadNodeAndReplaceContent(nodeProps, { ...nodeContent, content: appendedContent })
  }

  return {
    loadNode,
    fetchAndSaveNode,
    saveNodeName,
    loadNodeAndAppend,
    isLocalNode,
    loadNodeProps,
    getNode,
    saveApiAndUpdate
  }
}

export default useLoad
