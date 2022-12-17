import styled, { css } from 'styled-components'

import { Ellipsis } from './NodeSelect.style'

export const SnippetCards = styled.div<{ fullHeight?: boolean }>`
  padding: ${({ theme }) => theme.spacing.medium};
  display: flex;
  gap: ${({ theme }) => theme.spacing.medium};
  flex-direction: column;
  overflow: hidden;
  /* overscroll-behavior: contain; */
  ${({ fullHeight }) =>
    fullHeight !== false &&
    css`
      height: 100%;
    `}
`

export const SnippetCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.tokens.surfaces.s[3]};
  padding: ${({ theme }) => theme.spacing.small};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`

export const SnippetCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  font-size: 1.1rem;
  cursor: pointer;
  user-select: none;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`

export const SnippetCardFooter = styled.div`
  margin-top: ${({ theme }) => theme.spacing.small};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.tiny};

  color: ${({ theme }) => theme.tokens.text.fade};
`

export const SnippetContentPreview = styled.div`
  color: ${({ theme }) => theme.tokens.text.fade};
  font-size: 1em;
  ${Ellipsis}
`
