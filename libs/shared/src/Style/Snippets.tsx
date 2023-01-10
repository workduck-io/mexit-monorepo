import styled from 'styled-components'

import { Card } from './Card'
import { GridCss } from './Grid'
import { size } from './Responsive'
import { ResultDesc, SearchContainer } from './Search'

export const SSnippets = styled.div`
  /* ${GridCss(2, 3)} */
  display: flex;
  flex-wrap: wrap;
  flex-grow: 0;
`

export const SSnippet = styled(Card)`
  background-color: ${({ theme }) => theme.tokens.surfaces.s[2]};
  overflow: auto;
  margin: 1rem;
  padding: 1rem;
  aspect-ratio: 1/1;
  box-shadow: ${({ theme }) => theme.tokens.shadow.small};
  transition: box-shadow 0.2s ease-in-out;

  &:hover {
    box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
  }

  ::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }
`

export const SnippetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.small};
`

export const StyledSnippetPreview = styled.div`
  background-color: ${({ theme }) => theme.tokens.surfaces.s[2]};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  min-height: 80%;
`

export const SnippetCommandPrefix = styled.div`
  color: ${({ theme }) => theme.tokens.colors.primary.default};
`
export const SnippetCommand = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  margin: ${({ theme }) => theme.spacing.small} 0;
  color: ${({ theme }) => theme.tokens.colors.primary.default};
  gap: ${({ theme }) => theme.spacing.small};
`

export const PreviewDescription = styled.div`
  line-height: 1.75;
  color: ${({ theme }) => theme.tokens.text.default};
`

export const CreateSnippet = styled(Card)`
  color: ${({ theme }) => theme.tokens.text.fade};
  background-color: ${({ theme }) => theme.tokens.surfaces.s[2]};
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 600;
  font-size: 1.5rem;
  flex-direction: column;

  svg {
    color: ${({ theme }) => theme.tokens.colors.primary.default};
    filter: drop-shadow(0px 4px 10px ${({ theme }) => theme.tokens.colors.primary.default});
  }
`

export const SnippetsSearchContainer = styled(SearchContainer)`
  ${ResultDesc} {
    @media (max-width: ${size.normal}) {
      max-width: 15rem;
    }
  }
`
