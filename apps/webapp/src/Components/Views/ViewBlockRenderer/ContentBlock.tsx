import styled from 'styled-components'

import { MexIcon } from '@mexit/shared'

import { SearchBlockIcons } from '../../../Editor/Components/Blocks/BlockIcons'

const ContentBlockContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
`

const ContentBlock = ({ block }) => {
  return (
    <ContentBlockContainer>
      <MexIcon width={20} height={20} icon={SearchBlockIcons[block?.doc?.entity]} />
      {block?.doc?.text}
    </ContentBlockContainer>
  )
}

export default ContentBlock
