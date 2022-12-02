import 'react-contexify/dist/ReactContexify.css'

import { useMemo } from 'react'
import toast from 'react-hot-toast'

import { TreeItem } from '@atlaskit/tree'
import addCircleLine from '@iconify/icons-ri/add-circle-line'
import archiveLine from '@iconify/icons-ri/archive-line'
import magicLine from '@iconify/icons-ri/magic-line'
import shareLine from '@iconify/icons-ri/share-line'
import volumeDownLine from '@iconify/icons-ri/volume-down-line'
import volumeMuteLine from '@iconify/icons-ri/volume-mute-line'
import { Icon } from '@iconify/react'
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'

import { LastOpenedState } from '@mexit/shared'

import { useCreateNewNote } from '../../Hooks/useCreateNewNote'
import { useLastOpened } from '../../Hooks/useLastOpened'
import { useNamespaces } from '../../Hooks/useNamespaces'
import { useNavigation } from '../../Hooks/useNavigation'
import { useRefactor } from '../../Hooks/useRefactor'
import { NavigationType,ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { useContentStore } from '../../Stores/useContentStore'
import { useDataStore } from '../../Stores/useDataStore'
import useModalStore, { ModalsType } from '../../Stores/useModalStore'
import { useShareModalStore } from '../../Stores/useShareModalStore'
import { useSnippetStore } from '../../Stores/useSnippetStore'
import { ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from '../../Style/contextMenu'
import { useDeleteStore } from '../Refactor/DeleteModal'
import { doesLinkRemain } from '../Refactor/doesLinkRemain'

import ContextMenuListWithFilter from './ContextMenuListWithFilter'

interface MuteMenuItemProps {
  nodeid: string
  lastOpenedState: LastOpenedState
}

export const MuteMenuItem = ({ nodeid, lastOpenedState }: MuteMenuItemProps) => {
  const { muteNode, unmuteNode } = useLastOpened()

  const isMuted = useMemo(() => {
    return lastOpenedState === LastOpenedState.MUTED
  }, [lastOpenedState])

  const handleMute = () => {
    // mog('handleMute', { item })
    if (isMuted) {
      unmuteNode(nodeid)
    } else {
      muteNode(nodeid)
    }
  }

  return (
    <ContextMenuItem
      onSelect={(args) => {
        handleMute()
      }}
    >
      <Icon icon={isMuted ? volumeDownLine : volumeMuteLine} />
      {isMuted ? 'Unmute' : 'Mute'}
    </ContextMenuItem>
  )
}

interface TreeContextMenuProps {
  item: TreeItem
}

export const MENU_ID = 'Tree-Menu'

export const TreeContextMenu = ({ item }: TreeContextMenuProps) => {
  // const prefillRefactorModal = useRefactorStore((store) => store.prefillModal)
  const openDeleteModal = useDeleteStore((store) => store.openModal)
  const { createNewNote } = useCreateNewNote()
  const openShareModal = useShareModalStore((store) => store.openModal)
  // const { onPinNote, onUnpinNote, isPinned } = usePinnedWindows()
  const toggleModal = useModalStore((store) => store.toggleOpen)
  const { goTo } = useRouting()
  const namespaces = useDataStore((store) => store.namespaces)
  const { getNamespaceIcon } = useNamespaces()

  const { execRefactorAsync } = useRefactor()
  const { push } = useNavigation()

  const itemNamespace = namespaces.find((ns) => ns.id === item.data?.namespace)

  // const handleRefactor = (item: TreeItem) => {
  //   prefillRefactorModal({ path: item?.data?.path, namespaceID: item.data?.namespace })
  //   // openRefactorModal()
  // }
  const contents = useContentStore((store) => store.contents)
  const hasTemplate = useMemo(() => {
    const metadata = contents[item.data.nodeid]?.metadata

    const templates = useSnippetStore
      .getState()
      .snippets.filter((item) => item?.template && item.id === metadata?.templateID)

    return templates.length !== 0
  }, [item.data.nodeid, contents])

  const isInSharedNamespace = itemNamespace?.granterID !== undefined
  const isReadonly = itemNamespace?.access === 'READ'

  const handleArchive = (item: TreeItem) => {
    openDeleteModal({ path: item.data.path, namespaceID: item.data.namespace })
  }

  const handleCreateChild = (item: TreeItem) => {
    // mog('handleCreateChild', { item })
    const node = createNewNote({ parent: { path: item.data.path, namespace: item.data.namespace } })
    goTo(ROUTE_PATHS.node, NavigationType.push, node?.nodeid)
  }

  const handleShare = (item: TreeItem) => {
    openShareModal('permission', 'note', item.data.nodeid)
  }

  // BUG: The backend doesn't return the new added path in the selected namespace
  const handleMoveNamespaces = async (newNamespaceID: string) => {
    console.log(`Item: ${JSON.stringify(item)}`)
    const refactored = await execRefactorAsync(
      { path: item.data?.path, namespaceID: item.data?.namespace },
      { path: item.data?.path, namespaceID: newNamespaceID }
    )

    if (doesLinkRemain(item.data?.nodeid, refactored)) {
      push(item.data?.nodeid, { savePrev: false })
    }
  }

  const handleTemplate = (item: TreeItem) => {
    if (item.data.path !== 'Drafts') {
      toggleModal(ModalsType.template, item.data)
    } else {
      toast.error('Template cannot be set for Drafts hierarchy')
    }
  }

  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuContent>
        {/* Fix after refactor modal proper state transfer to ModalStore
          <ContextMenuItem
            onSelect={(args) => {
              handleRefactor(item)
            }}
          >
            <Icon icon={editLine} />
            Refactor
          </ContextMenuItem> */}
        <ContextMenuItem
          disabled={isInSharedNamespace && isReadonly}
          onSelect={(args) => {
            handleCreateChild(item)
          }}
        >
          <Icon icon={addCircleLine} />
          New Note
        </ContextMenuItem>
        <ContextMenuItem
          onSelect={(args) => {
            handleTemplate(item)
          }}
        >
          <Icon icon={magicLine} />
          {hasTemplate ? 'Change Template' : 'Set Template'}
        </ContextMenuItem>
        <ContextMenuItem
          disabled={isInSharedNamespace && isReadonly}
          onSelect={(args) => {
            handleShare(item)
          }}
        >
          <Icon icon={shareLine} />
          Share
        </ContextMenuItem>
        <ContextMenuListWithFilter
          disabled={isInSharedNamespace}
          item={{
            id: 'menu_for_namespace',
            label: 'Move to Space',
            icon: { type: 'ICON', value: 'ri:file-transfer-line' }
          }}
          items={namespaces
            // Don't move in same namespace
            // And don't move to spaces that are not of the user
            .filter((ns) => ns.id !== item.data.namespace && !ns.granterID)
            .map((ns) => ({
              id: ns.id,
              icon: getNamespaceIcon(ns),
              disabled: isInSharedNamespace,
              label: ns.name
            }))}
          onSelectItem={(args) => {
            handleMoveNamespaces(args)
          }}
          filter={false}
        />
        <ContextMenuSeparator />
        <MuteMenuItem nodeid={item.data.nodeid} lastOpenedState={item.data.lastOpenedState} />
        <ContextMenuItem
          color="#df7777"
          disabled={isInSharedNamespace && itemNamespace?.access === 'READ'}
          onSelect={(args) => {
            handleArchive(item)
          }}
        >
          <Icon icon={archiveLine} />
          Archive
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenuPrimitive.Portal>
  )
}
