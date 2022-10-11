import sendToIcon from '@iconify/icons-ph/arrow-bend-up-right-bold'
import xBold from '@iconify/icons-ph/x-bold'
import moveToIcon from '@iconify/icons-ri/anticlockwise-2-fill'
import deleteBin6Line from '@iconify/icons-ri/delete-bin-6-line'
import { Button } from '@udecode/plate'
import styled, { useTheme } from 'styled-components'

import { ContextMenuActionType } from '@mexit/core'
import { MexIcon } from '@mexit/shared'

import { PrimaryText } from '../../../Components/EditorInfobar/BlockInfobar'
import useBlockStore from '../../../Stores/useBlockStore'
import { ButtonWrapper } from '../../../Style/Settings'
import { useEditorBlockSelection } from '../../Actions/useEditorBlockSelection'

const BlockMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin: 2px 0;

  p {
    margin: 0;
    color: ${(props) => props.theme.colors.text.fade};
  }
`

const BlockInfoBar = () => {
  const setIsModalOpen = useBlockStore((store) => store.setIsModalOpen)
  const isBlockMode = useBlockStore((store) => store.isBlockMode)
  const blocks = useBlockStore((store) => store.blocks)
  const setIsBlockMode = useBlockStore((store) => store.setIsBlockMode)

  const { deleteSelectedBlock } = useEditorBlockSelection()
  const theme = useTheme()
  const length = Object.values(blocks).length
  const blockHeading = length === 0 ? 'Select Blocks' : `Block${length > 1 ? 's' : ''} selected:`

  const handleDelete = () => {
    deleteSelectedBlock(true)
    setIsModalOpen(undefined)
  }

  return (
    <BlockMenu>
      <Button onClick={() => setIsBlockMode(!isBlockMode)}>
        <MexIcon fontSize={20} $noHover color={theme.colors.primary} icon={xBold} /> Cancel
      </Button>
      <p>
        {blockHeading}
        {length > 0 && <PrimaryText>&#32;{length}</PrimaryText>}
      </p>
      <ButtonWrapper>
        <Button onClick={() => setIsModalOpen(ContextMenuActionType.move)}>
          <MexIcon fontSize={20} $noHover color={theme.colors.primary} icon={moveToIcon} />
          Move
        </Button>
        <Button onClick={() => setIsModalOpen(ContextMenuActionType.send)}>
          <MexIcon fontSize={20} $noHover color={theme.colors.primary} icon={sendToIcon} /> Send
        </Button>
        <Button onClick={() => handleDelete()}>
          <MexIcon fontSize={20} $noHover color={theme.colors.primary} icon={deleteBin6Line} />
          Delete
        </Button>
      </ButtonWrapper>
    </BlockMenu>
  )
}

export default BlockInfoBar
