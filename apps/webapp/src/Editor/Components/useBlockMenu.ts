import toast from 'react-hot-toast'

import { getPlateEditorRef } from '@udecode/plate'

import { ContextMenuActionType, useBlockStore } from '@mexit/core'

import { useTransform } from '../../Components/Editor/BalloonToolbar/components/useTransform'
import { useEditorBlockSelection } from '../Actions/useEditorBlockSelection'

export const useBlockMenu = () => {
  const { isConvertable } = useTransform()
  const setBlocks = useBlockStore((store) => store.setBlocks)
  const setIsModalOpen = useBlockStore((store) => store.setIsModalOpen)

  const { convertToBlocks: convertBlocks, deleteSelectedBlock } = useEditorBlockSelection()

  const convertToBlocks = () => {
    setBlocks(convertBlocks())
  }

  const onSendToClick = () => {
    const editor = getPlateEditorRef()

    if (!isConvertable(editor)) {
      toast.error('You can not move Flow links from one node to another.')
      return
    }

    convertToBlocks()
    setIsModalOpen(ContextMenuActionType.send)
  }

  const onMoveToClick = () => {
    const editor = getPlateEditorRef()

    if (!isConvertable(editor)) {
      toast.error('You can not move Flow links from one node to another.')
      return false
    }
    convertToBlocks()
    setIsModalOpen(ContextMenuActionType.move)
  }

  const onDeleteClick = () => {
    convertToBlocks()
    deleteSelectedBlock(true)
  }

  return {
    onMoveToClick,
    onDeleteClick,
    onSendToClick
  }
}
