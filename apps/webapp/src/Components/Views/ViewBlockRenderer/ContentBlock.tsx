import { useState } from 'react'

import arrowLeftSLine from '@iconify/icons-ri/arrow-left-s-line'
import styled, { css, useTheme } from 'styled-components'

import { SearchResult } from '@workduck-io/mex-search'

import { ModalsType, useModalStore } from '@mexit/core'
import { Group, MexIcon } from '@mexit/shared'

import { SearchBlockIcons } from '../../../Editor/Components/Blocks/BlockIcons'

import { SlideDownKeyFrames, SlideUpKeyFrames } from './BlockContainer/styled'
import { Chevron, GroupHeader } from './BlockContainer'

export const ContentBlockContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
`

export const BlockHeader = styled(GroupHeader)<{ isOpen?: boolean }>`
  transition: all 0.3s ease-in-out;
  animation: ${(props) => (props.isOpen ? SlideDownKeyFrames : SlideUpKeyFrames)} 0.3s ease-out;
  display: flex;
  align-items: flex-start;

  & svg {
    height: 20px;
    width: 20px;
  }
`

export const VerticalStretch = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  align-self: flex-start;
`

export const BlockContent = styled.div<{ isOpen?: boolean }>`
  ${({ isOpen }) =>
    !isOpen &&
    css`
      text-overflow: ellipsis;
      line-clamp: 1;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    `}

  color: ${({ theme }) => theme.tokens.text.default};
  display: -webkit-box;
  overflow: hidden;
  max-width: 90%;
  word-break: break-all;
`

type BlockProps = {
  block: SearchResult
}

const ContentBlock: React.FC<BlockProps> = ({ block }) => {
  const theme = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const toggleModal = useModalStore((store) => store.toggleOpen)

  const handleToggleAccordion = (ev) => {
    setIsOpen(!isOpen)

    if (ev.detail === 2) {
      toggleModal(ModalsType.previewNote, { noteId: block.parent, blockId: block.id })
    }
  }

  // Write a function to check double click

  const canOpen = block?.text?.length > 100
  const content = isOpen ? block?.text : block?.text?.slice(0, 100)

  return (
    <ContentBlockContainer>
      <BlockHeader isOpen={isOpen} onClick={handleToggleAccordion}>
        <Group>
          <VerticalStretch>
            <MexIcon
              color={theme.tokens.colors.primary.default}
              width={20}
              height={20}
              icon={SearchBlockIcons[block?.entity]}
            />
          </VerticalStretch>
          <BlockContent isOpen={isOpen}>{content}</BlockContent>
        </Group>
        {canOpen && <Chevron isOpen={isOpen} $noHover height={20} width={20} cursor="pointer" icon={arrowLeftSLine} />}
      </BlockHeader>
    </ContentBlockContainer>
  )
}

export default ContentBlock
