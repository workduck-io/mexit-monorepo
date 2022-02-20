import archiveLine from '@iconify-icons/ri/archive-line'
import editLine from '@iconify-icons/ri/edit-line'
import refreshFill from '@iconify-icons/ri/refresh-fill'
import shareLine from '@iconify-icons/ri/share-line'
import { Icon } from '@iconify/react'
import React from 'react'
import { Item, ItemParams, Separator, useContextMenu } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.css'

import { StyledMenu } from '../../Style/Menu'
import { useRenameStore } from '../../Store/useRenameStore'
import TreeNode from '../../Types/Tree'
import Tree from './Tree'

interface TreeProps {
  tree: TreeNode[]
}

interface ItemProps {
  id: string
}

const MENU_ID = 'Tree-Menu'

export const TreeWithContextMenu = ({ tree }: TreeProps) => {
  const openRenameModal = useRenameStore((store) => store.openModal)
  const { show } = useContextMenu({
    id: MENU_ID
  })

  function displayMenu({ event, node }: any) {
    show(event, { props: { id: node.id } })
  }

  function handleItemClick({ event, props: p, data, triggerEvent }: ItemParams<ItemProps, any>) {
    // console.log({ event, props, data, triggerEvent })
    switch (event.currentTarget.id) {
      case 'rename':
        // openRenameModal(p.id)
        break
      case 'archive':
        // openDeleteModal(p.id)
        break
      case 'sync':
        break
      case 'share':
        break
    }
  }

  return (
    <>
      <Tree tree={tree} displayMenu={displayMenu} />

      <StyledMenu id={MENU_ID}>
        <Item id="rename" onClick={handleItemClick}>
          <Icon icon={editLine} />
          Rename
        </Item>
        <Item id="archive" onClick={handleItemClick}>
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
    </>
  )
}
