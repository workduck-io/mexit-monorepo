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
import { StyledMenu } from '@mexit/shared'
import { useDeleteStore } from '../Refactor/DeleteModal'
import { useCreateNewNode } from '../../Hooks/useCreateNewNode'

interface ItemProps {
  id: string
  path: string
  onDisplayMenu: (nodeid: string) => void
}

export const MENU_ID = 'Tree-Menu'

export const TreeContextMenu = () => {
  const openRenameModal = useRenameStore((store) => store.openModal)
  const openDeleteModal = useDeleteStore((store) => store.openModal)
  const { createNewNode } = useCreateNewNode()

  async function handleItemClick({ event, props: p, data, triggerEvent }: ItemParams<ItemProps, any>) {
    // mog('handleItemClick', { event, p, data, triggerEvent })
    switch (event.currentTarget.id) {
      case 'rename':
        openRenameModal(p.path)
        break
      case 'archive':
        openDeleteModal(p.path)
        break
      case 'createChild':
        await createNewNode(p.path)
        break
      case 'sync':
        break
      case 'share':
        break
    }
  }

  return (
    <StyledMenu id={MENU_ID}>
      <Item id="rename" disabled={(args) => isReserved(args.props.path)} onClick={handleItemClick}>
        <Icon icon={editLine} />
        Rename
      </Item>
      <Item id="createChild" onClick={handleItemClick}>
        <Icon icon={addCircleLine} />
        Create Child
      </Item>
      <Item disabled={(args) => isReserved(args.props.path)} id="archive" onClick={handleItemClick}>
        <Icon icon={archiveLine} />
        Archive
      </Item>
      <Separator />
      <Item id="sync" onClick={handleItemClick}>
        <Icon icon={refreshFill} />
        Sync
      </Item>
      <Item id="share" onClick={handleItemClick}>
        <Icon icon={shareLine} />
        Share
      </Item>
    </StyledMenu>
  )
}
