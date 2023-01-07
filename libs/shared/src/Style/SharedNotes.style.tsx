import styled, { css } from 'styled-components'

import { ItemContent, StyledTreeItemSwitcher } from './Sidebar'

export const BList = styled.div`
  /* max-height: 15rem;
  overflow-x: hidden;
  overflow-y: auto; */
  list-style: none;
`

export const SnippetListWrapper = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 4rem;
  padding: ${({ theme }) => theme.spacing.small};
`

// Sidebar Item
// Does not have children
// For children with expand collapse, see StyledTreeItem
export const SItem = styled.div<{ selected: boolean }>`
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding-left: ${({ theme }) => theme.spacing.medium};
  gap: ${({ theme }) => theme.spacing.tiny};

  transition: 0.3s ease;
  &:hover {
    transition: 0s ease;
    background: ${({ theme }) => theme.tokens.surfaces.s[3]};
  }

  ${({ selected, theme }) =>
    selected &&
    css`
      background: ${theme.tokens.colors.primary.default};
      color: ${theme.tokens.colors.primary.text};
      svg {
        color: ${theme.tokens.colors.primary.text};
      }
      :hover {
        background: rgba(${theme.rgbTokens.colors.primary.default}, 0.8);
      }
      ${StyledTreeItemSwitcher} {
        &:hover svg {
          color: ${theme.tokens.colors.primary.text};
        }
      }
    `}
`

export const SharedBreak = styled.div`
  margin: ${({ theme }) => theme.spacing.medium} ${({ theme }) => theme.spacing.medium};
  width: 100%;
  height: 4px;
  background-color: ${({ theme }) => theme.tokens.surfaces.s[2]};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
`

export const SItemContent = styled(ItemContent)`
  svg {
    width: 16px;
    height: 16px;
    fill: ${({ theme }) => theme.tokens.text.heading};
  }
`
