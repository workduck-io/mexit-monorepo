import styled from 'styled-components'

import { Group } from '@mexit/shared'

export const PromptPreviewContainer = styled.section`
  padding: ${({ theme }) => theme.spacing.medium};
  line-height: 1.75;

  ${Group} {
    color: ${({ theme }) => theme.tokens.colors.primary.default};
    margin-bottom: ${({ theme }) => theme.spacing.small};
  }
`

export const PromptTitle = styled.span`
  font-size: 1rem;
`
export const PromptDescription = styled.div`
  font-size: 0.9rem;
  text-transform: capitalize;
  color: ${({ theme }) => theme.tokens.text.fade};
`
