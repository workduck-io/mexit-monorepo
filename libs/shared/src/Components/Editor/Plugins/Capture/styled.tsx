import styled from 'styled-components'

export const CaptureHighlightWrapper = styled.section`
  transition: padding 0.2s ease-in, border 0.2s ease-in;

  :hover {
    padding-left: ${({ theme }) => theme.spacing.medium};
    border-left: 4px solid ${({ theme }) => theme.tokens.colors.primary.default};
  }
`
