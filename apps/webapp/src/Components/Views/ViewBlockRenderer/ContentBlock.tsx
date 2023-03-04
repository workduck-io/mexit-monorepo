import { useState } from 'react'

import arrowDownSLine from '@iconify/icons-ri/arrow-down-s-line'
import arrowLeftSLine from '@iconify/icons-ri/arrow-left-s-line'
import styled, { css, useTheme } from 'styled-components'

import { SearchResult } from '@workduck-io/mex-search'

import { Group, MexIcon, PrimaryText } from '@mexit/shared'

import { SearchBlockIcons } from '../../../Editor/Components/Blocks/BlockIcons'

import { SlideDownKeyFrames, SlideUpKeyFrames } from './BlockContainer/styled'

const ContentBlockContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
`

const BlockHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const BlockContent = styled.div<{ isOpen?: boolean }>`
  transition: all 0.3s ease-in-out;
  animation: ${(props) => (props.isOpen ? SlideDownKeyFrames : SlideUpKeyFrames)} 0.3s ease-in-out;
  display: -webkit-box;

  ${({ isOpen }) =>
    !isOpen &&
    css`
      overflow: hidden;
      text-overflow: ellipsis;
      line-clamp: 1;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    `}
`

type BlockProps = {
  block: SearchResult
}

const ContentBlock: React.FC<BlockProps> = ({ block }) => {
  const theme = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const handleToggleAccordion = () => {
    setIsOpen(!isOpen)
  }

  const canOpen = block?.text.length > 100
  const content = isOpen ? block?.text : block?.text.slice(0, 100)

  return (
    <ContentBlockContainer>
      <BlockHeader>
        <Group>
          <MexIcon
            color={theme.tokens.colors.primary.default}
            width={20}
            height={20}
            icon={SearchBlockIcons[block?.entity]}
          />
          <PrimaryText>{block?.entity}</PrimaryText>
        </Group>
        {canOpen && <MexIcon onClick={handleToggleAccordion} icon={!isOpen ? arrowLeftSLine : arrowDownSLine} />}
      </BlockHeader>
      <BlockContent isOpen={isOpen}>{content}</BlockContent>
    </ContentBlockContainer>
  )
}

export default ContentBlock
