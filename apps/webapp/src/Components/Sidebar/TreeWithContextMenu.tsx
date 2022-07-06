import archiveLine from '@iconify/icons-ri/archive-line'
import editLine from '@iconify/icons-ri/edit-line'
import addCircleLine from '@iconify/icons-ri/add-circle-line'
import refreshFill from '@iconify/icons-ri/refresh-fill'
import shareLine from '@iconify/icons-ri/share-line'
import { Icon } from '@iconify/react'
import { isReserved } from '@mexit/core'
import React from 'react'
import { Item, ItemParams, Separator } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.css'
import { useRenameStore } from '../../Stores/useRenameStore'
import { StyledContexifyMenu } from '@mexit/shared'
import { useDeleteStore } from '../Refactor/DeleteModal'
import { useCreateNewNode } from '../../Hooks/useCreateNewNode'
import { TreeItem } from '@atlaskit/tree'
import { useShareModalStore } from '../../Stores/useShareModalStore'
import { ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from '../../Style/contextMenu'

interface TreeContextMenuProps {
  item: TreeItem
}

export const MENU_ID = 'Tree-Menu'

export const TreeContextMenu = ({ item }: TreeContextMenuProps) => {
  const openRenameModal = useRenameStore((store) => store.openModal)
  const openDeleteModal = useDeleteStore((store) => store.openModal)
  const { createNewNode } = useCreateNewNode()
  const openShareModal = useShareModalStore((store) => store.openModal)

  const handleRename = (item: TreeItem) => {
    // mog('handleRename', { item })
    openRenameModal(item.data.path)
  }

  const handleArchive = (item: TreeItem) => {
    // mog('handleArchive', { item })
    openDeleteModal(item.data.path)
  }

  const handleCreateChild = (item: TreeItem) => {
    // mog('handleCreateChild', { item })
    createNewNode({ parent: item.data.path })
  }

  const handleShare = (item: TreeItem) => {
    // mog('handleShare', { item })
    openShareModal('permission', item.data.nodeid)
  }

  return (
    <>
      <ContextMenuContent>
        {/* TODO: no rename from context menu for now */}
        {/* <ContextMenuItem
          onSelect={(args) => {
            // console.log('onSelectRename', args, item)
            handleRename(item)
          }}
        >
          <Icon icon={editLine} />
          Rename
        </ContextMenuItem> */}
        <ContextMenuItem
          onSelect={(args) => {
            handleCreateChild(item)
          }}
        >
          <Icon icon={addCircleLine} />
          Create Child
        </ContextMenuItem>
        <ContextMenuItem
          onSelect={(args) => {
            handleArchive(item)
          }}
        >
          <Icon icon={archiveLine} />
          Archive
        </ContextMenuItem>
        <ContextMenuSeparator />
        {/* <ContextMenuItem>
          <Icon icon={refreshFill} />
          Sync
        </ContextMenuItem>
         */}
        <ContextMenuItem
          onSelect={(args) => {
            handleShare(item)
          }}
        >
          <Icon icon={shareLine} />
          Share
        </ContextMenuItem>
      </ContextMenuContent>
    </>
  )
}
