import React from 'react'
import { Item } from 'react-contexify'
import toast from 'react-hot-toast'
import deleteBin6Line from '@iconify/icons-ri/delete-bin-6-line'
import sendToIcon from '@iconify/icons-ph/arrow-bend-up-right-bold'
import moveToIcon from '@iconify/icons-ri/anticlockwise-2-fill'
import { Icon } from '@iconify/react'
import { getNodes, usePlateEditorRef } from '@udecode/plate'

import { useTransform } from '../../Components/Editor/BalloonToolbar/components/useTransform'
import useBlockStore from '../../Stores/useBlockStore'
import { StyledMenu } from '@mexit/shared'
import { BlockType, ContextMenuActionType } from '@mexit/core'

type BlockOptionsProps = {
  blockId: string
}

export const MENU_ID = 'block-options-menu'

export const BlockOptionsMenu: React.FC<BlockOptionsProps> = () => {
  const editor = usePlateEditorRef()
  const { isConvertable } = useTransform()
  const setBlocks = useBlockStore((store) => store.setBlocks)
  const setIsModalOpen = useBlockStore((store) => store.setIsModalOpen)

  const convertToBlocks = () => {
    const nodes = Array.from(
      getNodes(editor, {
        mode: 'highest',
        block: true,
        at: editor.selection
      })
    )

    const value = nodes.map(([node, _path]) => {
      return node
    })

    const blocks = value.reduce((prev: Record<string, BlockType>, current: BlockType) => {
      prev[current.id] = current
      return prev
    }, {})

    setBlocks(blocks)
  }

  const onSendToClick = (item: any) => {
    if (!isConvertable(editor)) {
      toast.error('You can not move Flow links from one node to another.')
      return
    }

    convertToBlocks()
    setIsModalOpen(ContextMenuActionType.send)
  }

  const onMoveToClick = (item: any) => {
    if (!isConvertable(editor)) {
      toast.error('You can not move Flow links from one node to another.')
      return false
    }
    convertToBlocks()
    setIsModalOpen(ContextMenuActionType.move)
  }

  const onDeleteClick = (item: any) => {
    convertToBlocks()
    setIsModalOpen(ContextMenuActionType.del)
  }

  return (
    <StyledMenu id={MENU_ID}>
      <Item id="send-to" onClick={onSendToClick}>
        <Icon icon={sendToIcon} />
        Send
      </Item>
      <Item id="move-to" onClick={onMoveToClick}>
        <Icon icon={moveToIcon} />
        Move
      </Item>
      <Item id="move-to" onClick={onDeleteClick}>
        <Icon icon={deleteBin6Line} />
        Delete
      </Item>
    </StyledMenu>
  )
}
