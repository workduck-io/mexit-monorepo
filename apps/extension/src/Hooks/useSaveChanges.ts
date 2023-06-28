import toast from 'react-hot-toast'

import { createPlateEditor, createPlateUI } from '@udecode/plate'

import {
  DefaultMIcons,
  deleteQueryParams,
  ELEMENT_TAG,
  extractMetadata,
  getHighlightBlockMap,
  Highlight,
  NodeProperties,
  RecentType,
  SaveableRange,
  SEPARATOR,
  SingleNamespace,
  useAuthStore,
  useContentStore,
  useDataStore,
  useFloatingStore,
  useHighlightStore,
  useMetadataStore,
  useRecentsStore,
  userPreferenceStore as useUserPreferenceStore
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
  const setpreferenceModifiedAtAndLastOpened = useUserPreferenceStore(
    (store) => store.setpreferenceModifiedAtAndLastOpened
  )

  /**
   * Save
   */
  const saveIt = async (options = { saveAndExit: false, notification: false }) => {
    setVisualState(VisualState.animatingOut)

    const node = useSputlitStore.getState().node
    const selection = useSputlitStore.getState().selection
    const nodeContent = useEditorStore.getState().nodeContent

    addRecent(RecentType.notes, node.nodeid)
    setpreferenceModifiedAtAndLastOpened(Date.now(), useRecentsStore.getState().lastOpened)

    setContent(node.nodeid, nodeContent)
    setSelection(undefined)
    setActiveItem()

    const { highlight, blockHighlightMap } = await createHighlightEntityFromSelection(
      selection,
      node.nodeid,
      nodeContent
    )

    const res = await saveNode({
      notify: options.notification,
      content: nodeContent,
      node,
      reqData: highlight ? { highlightId: highlight.entityId } : {}
    })

    if (res) {
      const nodeid = res.nodeId
      const content = res.content

      dispatchAfterSave(
        { nodeid, content, metadata: res.metadata, highlight, blockHighlightMap },
        options.saveAndExit,
        options.notification
      )
    }
  }

  const saveNode = async ({ node, content, notify, reqData }) => {
    const parentILink = getParentILink(node.path)
    const isRoot = node.path.split(SEPARATOR).length === 1
    const isSingle = !!parentILink || isRoot
    const namespace = getNamespaceOfNodeid(node?.nodeid) ?? getDefaultNamespace()

    dispatchLinkUpdates(node, namespace, isSingle)

    const saveNodeRequest = {
      type: 'CAPTURE_HANDLER',
      subType: isSingle ? 'SAVE_NODE' : 'BULK_CREATE_NODES',
      data: {
        path: isSingle ? undefined : createNoteHierarchyString(node.path, namespace.id),
        id: node.nodeid,
        title: node.title,
        content,
        referenceID: isSingle ? parentILink.nodeid : undefined,
        workspaceID: workspaceDetails.id,
        namespaceID: namespace.id,
        highlightId: undefined,
        ...(reqData ?? {})
      }
    }

    const response = await chrome.runtime.sendMessage(saveNodeRequest)

    if (response) {
      const { message, error } = response

      if (error && notify) {
        toast.error('An Error Occured. Please try again.')
        return
      }

      if (message) {
        const nodeId = message.node?.id ?? message.id
        const nodeContent = message.content ?? content
        const title = message.node?.title ?? message.title
        const metadata = extractMetadata(message.node ?? message, { icon: DefaultMIcons.NOTE })

        setContent(nodeId, nodeContent)
        updateMetadata('notes', nodeId, metadata)
        updateDocument({ id: nodeId, contents: nodeContent, title })
        addRecent(RecentType.notes, nodeId)
        setpreferenceModifiedAtAndLastOpened(Date.now(), useRecentsStore.getState().lastOpened)

        return {
          nodeId: nodeId,
          content: nodeContent,
          title,
          metadata
        }
      }
    }
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

    if (highlightId) {
      addHighlightInStore({
        entityId: highlightId,
        ...highlight
      })

      toast('Highlight saved!')
    } else {
      toast('Unable to save highlight currently, Please try again later')
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
    const highlight: Highlight = isCapturedHighlight && {
      properties: {
        sourceUrl: selection?.range && deleteQueryParams(window.location.href),
        saveableRange: selection?.range,
        content: serializeContent(content, '')
      }
    }

    if (highlight) {
      // Save highlight
      const sourceTitle = document.title
      const highlightId = await saveHighlight(highlight, sourceTitle)

      if (highlightId) {
        const updateContent = content?.map((block) => {
          return {
            ...block,
            metadata: {
              elementMetadata: {
                id: highlightId,
                type: 'highlightV1'
              }
            }
          }
        })

        highlight.entityId = highlightId

        // Extract the blockids for which we have captured highlights
        const blockHighlightMap = getHighlightBlockMap(nodeid, updateContent)

        // Add highlight in local store and nodeblockmap
        addHighlight(highlight, blockHighlightMap)
        return { highlight, blockHighlightMap }
      }
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
  const dispatchAfterSave = ({ nodeid }: DispatchData, saveAndExit = false, notification = false) => {
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
    // addRecent(node.nodeid)
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
    appendAndSave,
    saveNode
  }
}
