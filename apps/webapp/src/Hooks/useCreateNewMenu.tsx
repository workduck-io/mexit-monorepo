import toast from 'react-hot-toast'

import { TreeItem } from '@atlaskit/tree'
import { ELEMENT_PARAGRAPH } from '@udecode/plate'
import generateName from 'project-name-generator'

import { defaultContent, generateSnippetId, MIcon } from '@mexit/core'
import { DefaultMIcons, InteractiveToast } from '@mexit/shared'

import { useDeleteStore } from '../Components/Refactor/DeleteModal'
import { doesLinkRemain } from '../Components/Refactor/doesLinkRemain'
import { useTaskViewModalStore } from '../Components/TaskViewModal'
import { useBlockMenu } from '../Editor/Components/useBlockMenu'
import { useDataStore } from '../Stores/useDataStore'
import { useLayoutStore } from '../Stores/useLayoutStore'
import { useMetadataStore } from '../Stores/useMetadataStore'
import useModalStore, { ModalsType } from '../Stores/useModalStore'
import { useUserPreferenceStore } from '../Stores/userPreferenceStore'
import { useShareModalStore } from '../Stores/useShareModalStore'
import { useSnippetStore } from '../Stores/useSnippetStore'

import { useCreateNewNote } from './useCreateNewNote'
import { useNamespaces } from './useNamespaces'
import { useNavigation } from './useNavigation'
import { useRefactor } from './useRefactor'
import { NavigationType, ROUTE_PATHS, useRouting } from './useRouting'
import { useSnippets } from './useSnippets'
import { useTaskViews, useViewStore, View } from './useTaskViews'

interface MenuListItemType {
  id: string
  label: string
  disabled?: boolean
  icon?: MIcon
  onSelect: any
  options?: Array<MenuListItemType>
}

const getMenuItem = (
  label: string,
  onSelect: any,
  disabled?: boolean,
  icon?: MIcon,
  options?: Array<MenuListItemType>
) => ({
  id: label,
  label,
  onSelect,
  icon,
  disabled,
  options
})

export const useCreateNewMenu = () => {
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const toggleModal = useModalStore((store) => store.toggleOpen)
  const { addDefaultNewNamespace, getDefaultNamespaceId } = useNamespaces()
  const setCurrentView = useViewStore((store) => store.setCurrentView)
  const changeSpace = useUserPreferenceStore((store) => store.setActiveNamespace)
  const expandSidebar = useLayoutStore((store) => store.expandSidebar)
  const openShareModal = useShareModalStore((store) => store.openModal)
  const openDeleteModal = useDeleteStore((store) => store.openModal)
  const openTaskViewModal = useTaskViewModalStore((store) => store.openModal)

  const { goTo } = useRouting()
  const { push } = useNavigation()
  const { deleteView } = useTaskViews()
  const { addSnippet } = useSnippets()
  const { execRefactorAsync } = useRefactor()
  const { createNewNote } = useCreateNewNote()
  const blockMenuItems = useBlockMenu()

  const createNewNamespace = () => {
    addDefaultNewNamespace()
      .then((ns) => {
        if (ns) changeSpace(ns.id)
        return ns
      })
      .then((ns) => {
        toast.custom((t) => (
          <InteractiveToast
            tid={t.id}
            message={`Created new space: ${ns?.name}`}
            actionName="Open"
            onClick={() => {
              if (ns) changeSpace(ns.id)
              expandSidebar()
            }}
          />
        ))
      })
  }

  const createNewNoteInNamespace = (namespaceId: string) => {
    const note = createNewNote({ namespace: namespaceId, noteContent: defaultContent.content })

    if (note) {
      goTo(ROUTE_PATHS.node, NavigationType.push, note?.nodeid)
    }
  }

  const onCreateNewSnippet = (template = false) => {
    // Create a better way.
    const snippetId = generateSnippetId()
    const snippetName = generateName().dashed

    addSnippet({
      id: snippetId,
      title: snippetName,
      icon: DefaultMIcons.SNIPPET,
      template,
      content: [{ children: [{ text: '' }], type: ELEMENT_PARAGRAPH }]
    })

    loadSnippet(snippetId)

    goTo(ROUTE_PATHS.snippet, NavigationType.push, snippetId, { title: snippetName })
  }

  const handleTemplate = (item: TreeItem) => {
    if (item.data.path !== 'Drafts') {
      toggleModal(ModalsType.template, item.data)
    } else {
      toast.error('Template cannot be set for Drafts hierarchy')
    }
  }

  const handleCreateChild = (item: TreeItem) => {
    const node = createNewNote({ parent: { path: item.data.path, namespace: item.data.namespace } })
    goTo(ROUTE_PATHS.node, NavigationType.push, node?.nodeid)
  }

  const handleShare = (item: TreeItem) => {
    openShareModal('permission', 'note', item.data.nodeid)
  }

  const getMoveToNamespaceItems = () => {
    const item = useLayoutStore.getState().contextMenu?.item
    const namespace = useDataStore.getState().namespaces?.filter((i) => !i.granterID && i.id !== item.data?.namespace)

    return namespace.map((ns) => getMenuItem(ns.name, () => handleMoveNamespaces(item, ns.id), false, ns.icon))
  }

  const handleArchive = (item: TreeItem) => {
    openDeleteModal({ path: item.data.path, namespaceID: item.data.namespace })
  }

  const handleMoveNamespaces = async (item: TreeItem, newNamespaceID: string) => {
    const refactored = await execRefactorAsync(
      { path: item.data?.path, namespaceID: item.data?.namespace },
      { path: item.data?.path, namespaceID: newNamespaceID }
    )

    if (doesLinkRemain(item.data?.nodeid, refactored)) {
      push(item.data?.nodeid, { savePrev: false })
    }
  }

  const handleViewDelete = async (view: View) => {
    const currentView = useViewStore.getState().currentView
    await deleteView(view.id)
    if (currentView?.id === view.id) {
      setCurrentView(undefined)
      goTo(ROUTE_PATHS.tasks, NavigationType.push)
    }
  }

  const handleViewClone = (view: View) => {
    openTaskViewModal({
      filters: view.filters,
      cloneViewId: view.id,
      properties: {
        viewType: view.viewType,
        sortOrder: view.sortOrder,
        sortType: view.sortType,
        globalJoin: view.globalJoin
      }
    })
  }

  /**
   * Menu Items Getter Functions
   * @returns Array<MenuListItemType>
   */

  const getTreeMenuItems = (): Array<MenuListItemType> => {
    const item = useLayoutStore.getState().contextMenu?.item
    const namespace = useDataStore.getState().namespaces?.find((i) => i.id === item.data?.namespace)
    const disabled = namespace?.granterID !== undefined && namespace.access === 'READ'
    const noteMetadata = useMetadataStore.getState().metadata.notes?.[item?.data?.nodeid]

    const snippets = useSnippetStore.getState().snippets ?? {}
    const templates = Object.values(snippets).filter((item) => item?.template && item.id === noteMetadata?.templateID)

    const hasTemplate = templates.length !== 0

    return [
      getMenuItem('New Note', () => handleCreateChild(item), disabled, DefaultMIcons.NOTE),
      getMenuItem(
        `${hasTemplate ? 'Change' : 'Set'} Template`,
        () => handleTemplate(item),
        disabled,
        DefaultMIcons.TEMPLATE
      ),
      getMenuItem(
        'Move To Space',
        () => {
          // * Can use to open modal
        },
        disabled,
        DefaultMIcons.SPACE,
        getMoveToNamespaceItems()
      ),
      getMenuItem('Share', () => handleShare(item), disabled, DefaultMIcons.SHARED_NOTE),
      getMenuItem('Archive', () => handleArchive(item), disabled, DefaultMIcons.ARCHIVE)
    ]
  }

  const getSnippetsMenuItems = (): MenuListItemType[] => {
    return [getMenuItem('New Snippet', onCreateNewSnippet), getMenuItem('New Template', () => onCreateNewSnippet(true))]
  }

  const getViewMenuItems = (): MenuListItemType[] => {
    const item = useLayoutStore.getState().contextMenu?.item

    return [
      getMenuItem('Clone', () => handleViewClone(item?.data), false, DefaultMIcons.COPY),
      getMenuItem('Delete', () => handleViewDelete(item?.data), false, DefaultMIcons.DELETE)
    ]
  }

  const getBlockMenuItems = (): MenuListItemType[] => {
    return [
      getMenuItem('Send', blockMenuItems.onSendToClick, false, DefaultMIcons.SEND),
      getMenuItem('Move', blockMenuItems.onMoveToClick, false, DefaultMIcons.MOVE),
      getMenuItem('Delete', blockMenuItems.onDeleteClick, false, DefaultMIcons.DELETE)
    ]
  }

  const getCreateNewMenuItems = (_path?: string): MenuListItemType[] => {
    const currentSpace = useUserPreferenceStore.getState().activeNamespace

    return [
      getMenuItem('New Note', () => createNewNoteInNamespace(currentSpace || getDefaultNamespaceId())),
      getMenuItem('New Space', createNewNamespace),
      getMenuItem('New Snippet', onCreateNewSnippet)
    ]
  }

  return { getCreateNewMenuItems, getSnippetsMenuItems, getBlockMenuItems, getTreeMenuItems, getViewMenuItems }
}
