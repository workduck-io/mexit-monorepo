import useDataStore from '../Stores/useDataStore'
import useEditorStore, { NodeProperties } from '../Stores/useEditorStore'
import { NodeEditorContent } from '../Types/Types'
import { useApi } from './useApi'
import { getContent } from '../Stores/useEditorStore'
import useContentStore from '../Stores/useContentStore'

export interface LoadNodeOptions {
  savePrev?: boolean
  fetch?: boolean
  node?: NodeProperties
  withLoading?: boolean
}

export type LoadNodeFn = (nodeid: string, options?: LoadNodeOptions) => void

const useLoad = () => {
  const loadNodeEditor = useEditorStore((store) => store.loadNode)
  const loadNodeAndReplaceContent = useEditorStore((store) => store.loadNodeAndReplaceContent)
  const setFetchingContent = useEditorStore((store) => store.setFetchingContent)
  const setContent = useContentStore((store) => store.setContent)
  //   const editorNodeId = useEditorStore((state) => state.node.nodeid)
  //   const setNodePreview = useGraphStore((store) => store.setNodePreview)
  //   const setSelectedNode = useGraphStore((store) => store.setSelectedNode)
  const { getDataAPI, saveDataAPI } = useApi()
  //   const setSuggestions = useSuggestionStore((store) => store.setSuggestions)
  //   const { toggleSuggestedNodes, showSuggestedNodes } = useToggleElements()

  // const { saveNodeAPIandFs } = useDataSaverFromContent()
  //   const { saveAndClearBuffer } = useEditorBuffer()
  // const { saveQ } = useSaveQ()

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
      key: text
    }

    return node
  }

  /*
   * Fetches the node and saves it to local state
   * Should be used when current editor content is irrelevant to the node
   */
  const fetchAndSaveNode = (node: NodeProperties, withLoading = true) => {
    if (withLoading) setFetchingContent(true)
    getDataAPI(node.nodeid)
      .then((nodeData) => {
        if (nodeData) {
          const { content, metadata } = nodeData

          if (content) {
            const nodeContent = {
              type: 'editor',
              content,
              metadata
            }

            loadNodeAndReplaceContent(node, nodeContent)
            setContent(node.nodeid, content, metadata)
            if (withLoading) setFetchingContent(false)
          }
        }
      })
      .catch((e) => {
        console.error(e)
      })
      .finally(() => {
        if (withLoading) setFetchingContent(false)
      })
  }

  // const saveDebouncedAPIfs = () => {
  // const oldNode = useEditorStore.getState().node
  // if (oldNode && oldNode.nodeid !== '__null__') saveNodeAPIandFs(oldNode.nodeid)
  // }

  /**
   * Loads a node in the editor.
   * This does not navigate to editor.
   */
  const loadNode: LoadNodeFn = (nodeid, options = { savePrev: true, fetch: true, withLoading: true }) => {
    const hasBeenLoaded = false
    const node = options.node ?? getNode(nodeid)
    if (options.fetch && !hasBeenLoaded) {
      fetchAndSaveNode(node, options.withLoading)
    }
    loadNodeEditor(node)
  }

  const loadNodeProps = (nodeProps: NodeProperties) => {
    loadNodeEditor(nodeProps)
  }

  const loadNodeAndAppend = async (nodeid: string, content: NodeEditorContent) => {
    const nodeProps = getNode(nodeid)
    const nodeContent = getContent(nodeid)

    loadNodeAndReplaceContent(nodeProps, { ...nodeContent, content: [...nodeContent.content, ...content] })
  }

  return { loadNode, fetchAndSaveNode, loadNodeAndAppend, loadNodeProps, getNode }
}

export default useLoad
