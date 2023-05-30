import toast from 'react-hot-toast'

import { createPlateEditor, createPlateUI } from '@udecode/plate'

import {
  DefaultMIcons,
  deleteQueryParams,
  ELEMENT_TAG,
  extractMetadata,
  generateHighlightId,
  getHighlightBlockMap,
  Highlight,
  mog,
  NodeProperties,
  SaveableRange,
  SEPARATOR,
  SingleNamespace,
  useAuthStore,
  useContentStore,
  useDataStore,
  useFloatingStore,
  useHighlightStore,
  useMetadataStore,
  useRecentsStore
} from '@mexit/core'
import { getDeserializeSelectionToNodes } from '@mexit/shared'

import { CopyTag } from '../Editor/components/Tags/CopyTag'
import { generateEditorPluginsWithComponents } from '../Editor/plugins'
import { useSputlitStore } from '../Stores/useSputlitStore'
import { serializeContent } from '../Utils/serializer'

import { useEditorStore } from './useEditorStore'
import { useHighlights } from './useHighlights'
import { useInternalLinks } from './useInternalLinks'
import { useNamespaces } from './useNamespaces'
import { useNodes } from './useNodes'
import { useSearch } from './useSearch'
import { useSputlitContext, VisualState } from './useSputlitContext'

export interface AppendAndSaveProps {
  nodeid: string
  content: any[]
  highlight?: boolean
  saveAndExit?: boolean
  notification?: boolean
}

export function useSaveChanges() {
  const workspaceDetails = useAuthStore((store) => store.workspaceDetails)
  const { setPreviewMode } = useEditorStore()
  const { getParentILink, getEntirePathILinks, updateMultipleILinks, updateSingleILink, createNoteHierarchyString } =
    useInternalLinks()
  const { updateDocument, updateBlocks } = useSearch()
  const { setVisualState } = useSputlitContext()
  const setNode = useSputlitStore((s) => s.setNode)
  const setSelection = useSputlitStore((s) => s.setSelection)

  const setActiveItem = useSputlitStore((s) => s.setActiveItem)
  const ilinks = useDataStore((s) => s.ilinks)
  const sharedNodes = useDataStore((s) => s.sharedNodes)
  const setFloatingElement = useFloatingStore((store) => store.setFloatingElement)

  const setContent = useContentStore((s) => s.setContent)
  const appendContent = useContentStore((s) => s.appendContent)
  const updateMetadata = useMetadataStore((s) => s.updateMetadata)
  const addRecent = useRecentsStore((store) => store.addRecent)
  const addHighlight = useHighlightStore((s) => s.addHighlight)
  const addHighlightInStore = useHighlightStore((s) => s.addHighlightEntity)
  const { isSharedNode } = useNodes()
  const { getDefaultNamespace, getNamespaceOfNodeid } = useNamespaces()
  const { saveHighlight } = useHighlights()
  const addRecentNote = useRecentsStore((s) => s.addRecent)

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
        referenceID: isSingle ? parentILink?.nodeid : undefined,
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
        const content = message.content ?? request.data.content
        const metadata = extractMetadata(!bulkCreateRequest ? message : message.node, { icon: DefaultMIcons.NOTE })

        setContent(nodeid, content)

        const title = !bulkCreateRequest ? message.title : message.node.title
        updateDocument({ id: nodeid, contents: content, title })

        mog('DispatchAfterSave', { response, nodeid, content, metadata, highlight, blockHighlightMap })
        dispatchAfterSave({ nodeid, content, metadata, highlight, blockHighlightMap }, saveAndExit, notification)
      }
    })
  }

  /**
   * Add Highlight Entity
   */

  type SelectionHighlight = {
    html: string
    range: SaveableRange
  }

  const saveHighlightEntity = async (selection: SelectionHighlight) => {
    if (!selection) return

    const editor = createPlateEditor({
      plugins: generateEditorPluginsWithComponents(
        createPlateUI({
          [ELEMENT_TAG]: CopyTag
        }),
        {
          exclude: { dnd: true }
        }
      )
    })

    const content = getDeserializeSelectionToNodes({ text: selection?.html, metadata: null }, editor, false)

    const isCapturedHighlight = selection?.range && window.location.href

    const highlight = isCapturedHighlight && {
      properties: {
        sourceUrl: selection?.range && deleteQueryParams(window.location.href),
        saveableRange: selection?.range,
        content
      }
    }

    try {
      const highlightId = await saveHighlight(
        {
          ...highlight,
          properties: {
            ...highlight?.properties,
            content: serializeContent(content, '')
          }
        },
        document.title
      )
      addHighlightInStore({
        entityId: highlightId,
        ...highlight
      })
      toast('Highlight saved!')
    } catch (err) {
      console.error(err)
      toast('An error occured while saving the highlight. Please try again.')
    }
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
        sourceUrl: selection?.range && deleteQueryParams(window.location.href),
        saveableRange: selection?.range,
        content: serializeContent(content, '')
      }
    }

    if (highlight) {
      // Save highlight
      const updateContent = content?.map((block) => {
        return {
          ...block,
          metadata: {
            elementMetadata: {
              id: highlight.entityId,
              type: 'highlightV1'
            }
          }
        }
      })

      const sourceTitle = document.title
      await saveHighlight(highlight, sourceTitle)

      // Extract the blockids for which we have captured highlights
      const blockHighlightMap = getHighlightBlockMap(nodeid, updateContent)

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
    } else {
      const linksToBeCreated = getEntirePathILinks(node.path, node.nodeid, namespace.id)
      // Why is shared check not used here?
      updateMultipleILinks(linksToBeCreated)
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
    addRecentNote(nodeid)
    setContent(nodeid, content, metadata)

    if (notification) {
      toast.success('Saved to Cloud')
    }

    if (saveAndExit) {
      setVisualState(VisualState.animatingOut)
      // So that sputlit opens with preview true when it opens the next time
      setPreviewMode(true)
    }
  }

  const appendAndSave = async ({
    nodeid,
    content: toAppendContent,
    highlight,
    saveAndExit = true,
    notification = true
  }: AppendAndSaveProps) => {
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

    const request = {
      type: 'NODE_CONTENT',
      subType: 'APPEND_NODE',
      body: {
        id: node.nodeid,
        content: toAppendContent,
        workspaceID: workspaceDetails.id,
        namespaceID: namespace.id,
        highlightId: undefined,
        metadata: {}
      }
    }

    if (highlight) {
      const selection = useSputlitStore.getState().selection
      const { highlight, blockHighlightMap } = await createHighlightEntityFromSelection(
        selection,
        node.nodeid,
        toAppendContent
      )

      if (highlight) {
        request.body.highlightId = highlight.entityId
      }
    }

    setSelection(undefined)
    addRecent(node.nodeid)
    setActiveItem()

    const response = await chrome.runtime.sendMessage(request)

    const { message, error } = response

    if (error && notification) {
      toast.error('An Error Occured. Please try again.')
    } else {
      const title = message?.title ?? message?.node?.title
      const content = message?.content ?? request?.body?.content

      appendContent(node.nodeid, content)

      // * TODO: Pick updatedAt from response
      updateMetadata('notes', node.nodeid, { updatedAt: Date.now() })
      updateBlocks({
        id: node.nodeid,
        contents: content,
        title
      })

      if (notification) {
        toast.success('Saved to Cloud')
      }

      if (saveAndExit) {
        setVisualState(VisualState.animatingOut)
        // So that sputlit opens with preview true when it opens the next time
        setPreviewMode(true)
        setFloatingElement(undefined)
      }
    }
  }

  return {
    saveIt,
    saveHighlightEntity,
    appendAndSave
  }
}
