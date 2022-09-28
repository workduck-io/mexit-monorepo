import React from 'react'

import { TreeItem } from '@atlaskit/tree'
import addCircleLine from '@iconify/icons-ri/add-circle-line'
import archiveLine from '@iconify/icons-ri/archive-line'
import shareLine from '@iconify/icons-ri/share-line'
import { Icon } from '@iconify/react'
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'
import 'react-contexify/dist/ReactContexify.css'

import { useCreateNewNote } from '../../Hooks/useCreateNewNote'
import { useNamespaces } from '../../Hooks/useNamespaces'
import { useNavigation } from '../../Hooks/useNavigation'
import { useRefactor } from '../../Hooks/useRefactor'
import { useRouting, ROUTE_PATHS, NavigationType } from '../../Hooks/useRouting'
import { useDataStore } from '../../Stores/useDataStore'
import useModalStore from '../../Stores/useModalStore'
import { useRefactorStore } from '../../Stores/useRefactorStore'
import { useShareModalStore } from '../../Stores/useShareModalStore'
import { ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from '../../Style/contextMenu'
import { useDeleteStore } from '../Refactor/DeleteModal'
import { doesLinkRemain } from '../Refactor/doesLinkRemain'
import ContextMenuListWithFilter from './ContextMenuListWithFilter'

interface TreeContextMenuProps {
  item: TreeItem
}

export const MENU_ID = 'Tree-Menu'

export const TreeContextMenu = ({ item }: TreeContextMenuProps) => {
  const prefillRefactorModal = useRefactorStore((store) => store.prefillModal)
  const openDeleteModal = useDeleteStore((store) => store.openModal)
  const { createNewNote } = useCreateNewNote()
  const openShareModal = useShareModalStore((store) => store.openModal)
  // const { onPinNote, onUnpinNote, isPinned } = usePinnedWindows()
  // const toggleModal = useModalStore((store) => store.toggleOpen)
  const { goTo } = useRouting()
  const namespaces = useDataStore((store) => store.namespaces)
  const { getNamespaceIcon } = useNamespaces()

  const { execRefactorAsync } = useRefactor()
  const { push } = useNavigation()

  const handleRefactor = (item: TreeItem) => {
    prefillRefactorModal({ path: item?.data?.path, namespaceID: item.data?.namespace })
    // openRefactorModal()
  }

  const handleArchive = (item: TreeItem) => {
    openDeleteModal({ path: item.data.path, namespaceID: item.data.namespace })
  }

  const handleCreateChild = (item: TreeItem) => {
    // mog('handleCreateChild', { item })
    const node = createNewNote({ parent: { path: item.data.path, namespace: item.data.namespace } })
    goTo(ROUTE_PATHS.node, NavigationType.push, node?.nodeid)
  }

  const handleShare = (item: TreeItem) => {
    openShareModal('permission', item.data.nodeid)
  }

  // BUG: The backend doesn't return the new added path in the selected namespace
  const handleMoveNamespaces = async (newNamespaceID: string) => {
    const refactored = await execRefactorAsync(
      { path: item.data?.path, namespaceID: item.data?.namespace },
      { path: item.data?.path, namespaceID: newNamespaceID }
    )

    if (doesLinkRemain(item.data?.nodeid, refactored)) {
      push(item.data?.nodeid, { savePrev: false })
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
          onSelect={(args) => {
            handleCreateChild(item)
          }}
        >
          <Icon icon={addCircleLine} />
          New Note
        </ContextMenuItem>
        <ContextMenuItem
          onSelect={(args) => {
            handleShare(item)
          }}
        >
          <Icon icon={shareLine} />
          Share
        </ContextMenuItem>
        <ContextMenuListWithFilter
          item={{
            id: 'menu_for_namespace',
            label: 'Move to Space',
            icon: { type: 'ICON', value: 'ri:file-transfer-line' }
          }}
          items={namespaces
            // Don't move in same namespace
            .filter((ns) => ns.id !== item.data.namespace)
            .map((ns) => ({
              id: ns.id,
              icon: getNamespaceIcon(ns),
              label: ns.name
            }))}
          onSelectItem={(args) => {
            handleMoveNamespaces(args)
          }}
          filter={false}
        />
        <ContextMenuSeparator />{' '}
        {/* <MuteMenuItem nodeid={item.data.nodeid} lastOpenedState={item.data.lastOpenedState} /> */}
        <ContextMenuItem
          color="#df7777"
          // disabled
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
