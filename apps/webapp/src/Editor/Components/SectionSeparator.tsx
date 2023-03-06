import styled from 'styled-components'

import { RootElement } from '@mexit/shared'

const StyledSectionSeparator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.medium};

  width: 100%;

  span {
    width: 4rem;
    height: 2px;
    background: ${({ theme }) => theme.tokens.surfaces.highlight};
  }
`

const SectionSeparator = ({ attributes, children }) => {
  return (
    <RootElement {...attributes}>
      <StyledSectionSeparator contentEditable={false}>
        <span />
      </StyledSectionSeparator>
      {children}
    </RootElement>
  )
}

export default SectionSeparator
