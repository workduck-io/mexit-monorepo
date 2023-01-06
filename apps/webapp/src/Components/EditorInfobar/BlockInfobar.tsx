import sendToIcon from '@iconify/icons-ph/arrow-bend-up-right-bold'
import xBold from '@iconify/icons-ph/x-bold'
import moveToIcon from '@iconify/icons-ri/anticlockwise-2-fill'
import deleteBin6Line from '@iconify/icons-ri/delete-bin-6-line'
import styled, { useTheme } from 'styled-components'

import { Button } from '@workduck-io/mex-components'

import { ContextMenuActionType } from '@mexit/core'
import { MexIcon } from '@mexit/shared'

import { useEditorBlockSelection } from '../../Editor/Actions/useEditorBlockSelection'
import useBlockStore from '../../Stores/useBlockStore'
import { ButtonWrapper } from '../../Style/Settings'

export const PrimaryText = styled.span`
  color: ${({ theme }) => theme.tokens.colors.primary.default};
`

const BlockMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin: 2px 0;
  z-index: 999999;

  p {
    margin: 0;
    color: ${(props) => props.theme.tokens.text.fade};
  }
`

const BlockInfoBar = () => {
  const setIsModalOpen = useBlockStore((store) => store.setIsModalOpen)
  const isBlockMode = useBlockStore((store) => store.isBlockMode)
  const blocks = useBlockStore((store) => store.blocks)
  const setIsBlockMode = useBlockStore((store) => store.setIsBlockMode)

  setIsModalOpen(undefined)

  const { deleteSelectedBlock } = useEditorBlockSelection()
  const theme = useTheme()
  const length = Object.values(blocks).length
  const blockHeading = length === 0 ? 'Select Blocks' : `Block${length > 1 ? 's' : ''} selected:`

  const handleDelete = () => {
    deleteSelectedBlock(true)
    setIsModalOpen(undefined)
    setIsBlockMode(false)
  }

  return (
    <BlockMenu>
      <Button onClick={() => setIsBlockMode(!isBlockMode)}>
        <MexIcon fontSize={20} $noHover color={theme.tokens.colors.primary.default} icon={xBold} /> Cancel
      </Button>
      <p>
        {blockHeading}
        {length > 0 && <PrimaryText>&#32;{length}</PrimaryText>}
      </p>
      <ButtonWrapper>
        <Button onClick={() => setIsModalOpen(ContextMenuActionType.move)}>
          <MexIcon fontSize={20} $noHover color={theme.tokens.colors.primary.default} icon={moveToIcon} />
          Move
        </Button>
        <Button onClick={() => setIsModalOpen(ContextMenuActionType.send)}>
          <MexIcon fontSize={20} $noHover color={theme.tokens.colors.primary.default} icon={sendToIcon} /> Send
        </Button>
        <Button onClick={() => handleDelete()}>
          <MexIcon fontSize={20} $noHover color={theme.tokens.colors.primary.default} icon={deleteBin6Line} />
          Delete
        </Button>
      </ButtonWrapper>
    </BlockMenu>
  )
}

export default BlockInfoBar
