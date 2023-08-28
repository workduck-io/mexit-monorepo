import toast from 'react-hot-toast'

import {
  DefaultMIcons,
  DRAFT_NODE,
  getDefaultContent,
  getUntitledDraftKey,
  getUntitledKey,
  NodeEditorContent,
  RESERVED_NAMESPACES,
  useContentStore,
  useDataStore,
  useEditorStore,
  useMetadataStore
} from '@mexit/core'
import { useLinks } from '@mexit/shared'

import { updateILink } from '../Workers/controller'

import { useHierarchy } from './useHierarchy'
import { useLastOpened } from './useLastOpened'
import useLoad from './useLoad'
import { useNamespaces } from './useNamespaces'
import { useNavigation } from './useNavigation'
import { NavigationType, ROUTE_PATHS, useRouting } from './useRouting'
import { useSnippets } from './useSnippets'

export type NewNoteOptions = {
  path?: string
  parent?: {
    path: string
    namespace: string
  }
  noteId?: string
  noteContent?: NodeEditorContent
  noRedirect?: boolean
  // If provided added to that namespace
  // Otherwise default namespace
  namespace?: string
}

export const useCreateNewNote = () => {
  const { push } = useNavigation()
  const { goTo } = useRouting()
  const addILink = useDataStore((s) => s.addILink)
  const addMetadata = useMetadataStore((s) => s.addMetadata)
  const setDocUpdated = useContentStore((s) => s.setDocUpdated)
  const checkValidILink = useDataStore((s) => s.checkValidILink)
  const { saveNodeName } = useLoad()
  const { getParentILink } = useLinks()
  const { addInHierarchy } = useHierarchy()
  const { addLastOpened } = useLastOpened()
  const { getDefaultNamespace, getNamespace } = useNamespaces()

  const notesMetadata = useMetadataStore((s) => s.metadata.notes)
  const { getSnippet } = useSnippets()

  const createNewNote = (options?: NewNoteOptions) => {
    const nsID = options?.parent?.namespace ?? options?.namespace

    const ns = getNamespace(nsID)
    if (ns?.access === 'READ' || ns?.name === RESERVED_NAMESPACES.shared) {
      toast('You do not have permission to create a note in this namespace!')
      return
    }

    const childNodepath = options?.parent !== undefined ? getUntitledKey(options?.parent.path) : getUntitledDraftKey()
    const defaultNamespace = getDefaultNamespace()
    const namespacePath = options?.namespace && options?.namespace !== defaultNamespace?.id ? DRAFT_NODE : childNodepath

    const newNotePath = options?.path || namespacePath

    const uniquePath = checkValidILink({
      notePath: newNotePath,
      showAlert: false,
      namespace: nsID
    })

    // Use namespace of parent if namespace not provided
    const parentNote = getParentILink(uniquePath, nsID)
    const parentNoteId = parentNote?.nodeid

    const nodeMetadata = notesMetadata?.[parentNoteId]
    // Filling note content by template if nothing in options and notepath is not Drafts (it may cause problems with capture otherwise)
    const noteContent =
      options?.noteContent ??
      (nodeMetadata?.templateID && parentNote?.path !== DRAFT_NODE
        ? getSnippet(nodeMetadata.templateID)?.content
        : [getDefaultContent()])

    const namespace = options?.namespace ?? parentNote?.namespace ?? defaultNamespace?.id

    const node = addILink({
      ilink: uniquePath,
      nodeid: options?.noteId,
      showAlert: false,
      namespace
    })

    if (node === undefined) {
      toast.error('The node clashed')
      return undefined
    }

    addMetadata('notes', { [node.nodeid]: { icon: DefaultMIcons.NOTE } })

    updateILink({ ...node, parentNodeId: parentNoteId }).then((r) => {
      setDocUpdated()
    })

    addInHierarchy({
      noteId: node.nodeid,
      notePath: node.path,
      parentNoteId,
      noteContent,
      namespace: node.namespace
    }).then(() => {
      saveNodeName(useEditorStore.getState().node.nodeid)

      addLastOpened(node.nodeid)
    })
    if (!options?.noRedirect) {
      push(node.nodeid, { withLoading: false, fetch: false })

      goTo(ROUTE_PATHS.node, NavigationType.push, node.nodeid)
    }
    return node
  }

  return { createNewNote }
}
