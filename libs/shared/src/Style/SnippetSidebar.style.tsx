import styled, { css } from 'styled-components'

import { BodyFont } from './Search'

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
  font-size: 1.1em;
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
  color: ${({ theme }) => theme.tokens.text.default};
  opacity: 0.9;
  ${BodyFont}
  margin-top: ${({ theme }) => theme.spacing.small};

  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* number of lines to show */
  line-clamp: 3;
  -webkit-box-orient: vertical;
`
