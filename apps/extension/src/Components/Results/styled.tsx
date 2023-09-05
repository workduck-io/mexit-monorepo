import styled, { css } from 'styled-components'

import { PrimaryText, ScrollStyles } from '@mexit/shared'

export const StyledResults = styled.div<{ isScreenshot?: boolean }>`
  overflow: hidden auto;
  max-height: ${({ isScreenshot }) => (isScreenshot ? '75vh' : '300px')};
  width: 100%;

  color: ${({ theme }) => theme.tokens.text.fade};
  ${({ isScreenshot }) =>
    isScreenshot &&
    css`
      min-height: 300px;
    `};
  ${({ theme }) => ScrollStyles(theme.tokens.surfaces.s[4])}
`

export const Subtitle = styled.div`
  margin: 0.5em 1em;
  display: flex;
  align-items: center;

  font-size: 0.85em;

  ${PrimaryText} {
    max-width: 70ch;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  span:not(.query) {
    opacity: 0.5;
  }
`
