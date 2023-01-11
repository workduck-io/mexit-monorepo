import styled from 'styled-components'

import { Data, Group } from '@mexit/shared'

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

export const PromptMetadata = styled.div`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  padding: 0.5rem;
  border-top: 1px solid ${({ theme }) => theme.tokens.surfaces.s[2]};
  align-items: center;
  justify-content: space-between;

  button {
    padding: ${({ theme }) => theme.spacing.tiny};
  }

  ${Data} {
    font-size: 0.8em;
    color: ${({ theme }) => theme.tokens.text.fade};
  }
`

export const PromptCategory = styled.span`
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: ${({ theme }) => `${theme.spacing.tiny} ${theme.spacing.small}`};
  background: rgba(${({ theme }) => theme.rgbTokens.colors.secondary}, 0.2);
`
