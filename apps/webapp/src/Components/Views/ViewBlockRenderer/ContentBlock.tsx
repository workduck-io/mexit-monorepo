import { useMemo, useState } from 'react'

import styled, { css, useTheme } from 'styled-components'

import { SearchResult } from '@workduck-io/mex-search'

import { ModalsType, SuperBlocks, useModalStore } from '@mexit/core'
import { Group, MexIcon } from '@mexit/shared'

import { SearchBlockIcons } from '../../../Editor/Components/Blocks/BlockIcons'
import ContentSuperBlock from '../../../Editor/Components/SuperBlock/ContentSuperBlock'
import SmartCaptureSuperBlock from '../../../Editor/Components/SuperBlock/SmartCaptureSuperBlock'
import { PropertiyFields } from '../../../Editor/Components/SuperBlock/SuperBlock.types'
import useUpdateBlock from '../../../Editor/Hooks/useUpdateBlock'
import { useSearch } from '../../../Hooks/useSearch'
import { getBlock } from '../../../Utils/parseData'

import { SlideDownKeyFrames, SlideUpKeyFrames } from './BlockContainer/styled'
import { GroupHeader } from './BlockContainer'

export const ContentBlockContainer = styled.div`
  width: 100%;
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

export const CaptureBlock = ({ block }: BlockProps) => {
  const theme = useTheme()
  const toggleModal = useModalStore((store) => store.toggleOpen)

  const handleToggleAccordion = (ev) => {
    if (ev.detail === 2) {
      toggleModal(ModalsType.previewNote, { noteId: block.parent, blockId: block.id })
    }
  }

  return (
    <ContentBlockContainer onClick={handleToggleAccordion}>
      <Group>
        <VerticalStretch>
          <MexIcon
            color={theme.tokens.colors.primary.default}
            width={20}
            height={20}
            icon={SearchBlockIcons[block?.entity]}
          />
        </VerticalStretch>
        <SmartCaptureSuperBlock
          value={block.data.properties}
          metadata={block.data.metadata}
          isActive
          isSelected
          isReadOnly
          id={block.id}
          parent={block.parent}
          type={block.entity as any}
        >
          <div style={{ lineHeight: 1.58 }}>{block.text}</div>
        </SmartCaptureSuperBlock>
      </Group>
    </ContentBlockContainer>
  )
}

const ContentBlock: React.FC<BlockProps> = ({ block }) => {
  const theme = useTheme()
  const { setInfoOfBlockInContent } = useUpdateBlock()
  const { updateBlocks } = useSearch()

  const [isOpen, setIsOpen] = useState(false)
  const toggleModal = useModalStore((store) => store.toggleOpen)

  const content = useMemo(() => {
    const blockContent = getBlock(block.parent, block.id)
    if (blockContent) return [blockContent]

    return []
  }, [block.id])

  const handleToggleAccordion = (ev) => {
    setIsOpen(!isOpen)

    if (ev.detail === 2) {
      toggleModal(ModalsType.previewNote, { noteId: block.parent, blockId: block.id })
    }
  }

  const handleOnChange = (properties: Partial<PropertiyFields>) => {
    const noteId = block.parent

    const updatedBlock = setInfoOfBlockInContent(block.parent, {
      blockId: block.id,
      properties,
      useBuffer: true
    })

    updateBlocks({
      id: noteId,
      contents: [updatedBlock]
    })
  }

  const canOpen = block?.text?.length > 200

  return (
    <ContentBlockContainer onClick={handleToggleAccordion}>
      {/* <BlockHeader isOpen={isOpen} onClick={handleToggleAccordion}> */}
      {/* <VerticalStretch> */}
      {/*   <MexIcon */}
      {/*     color={theme.tokens.colors.primary.default} */}
      {/*     width={20} */}
      {/*     height={20} */}
      {/*     icon={SearchBlockIcons[block?.entity]} */}
      {/*   /> */}
      {/* </VerticalStretch> */}
      <ContentSuperBlock
        value={block.data.properties}
        metadata={block.data.metadata}
        isActive
        isSelected
        isReadOnly
        onChange={handleOnChange}
        id={block.id}
        parent={block.parent}
        type={SuperBlocks.CONTENT}
      >
        <div style={{ lineHeight: 1.58, wordWrap: 'break-word' }}>
          {block.text?.substring(0, 200) + (canOpen ? '...' : '')}
        </div>
        {/* <Plateless content={content} /> */}
      </ContentSuperBlock>
      {/* <BlockContent isOpen={isOpen}>{content}</BlockContent> */}
      {/* {canOpen && <Chevron isOpen={isOpen} $noHover height={20} width={20} cursor="pointer" icon={arrowLeftSLine} />} */}
      {/* </BlockHeader> */}
    </ContentBlockContainer>
  )
}

export default ContentBlock
