import { animated } from 'react-spring'
import styled, { css } from 'styled-components'

import { PrimaryText, Scroll, ScrollStyles } from '@mexit/shared'

export const StyledResults = styled.div<{ isScreenshot?: boolean }>`
  overflow: hidden auto;
  max-height: ${({ isScreenshot }) => (isScreenshot ? '75vh' : '300px')};
  width: 100%;

  color: ${({ theme }) => theme.colors.text.fade};
  ${({ isScreenshot }) =>
    isScreenshot &&
    css`
      min-height: 300px;
    `};
  ${({ theme }) => ScrollStyles(theme.colors.gray[7])}
`

export const List = styled.div`
  width: 100%;
  overflow: auto;
  position: relative;
  scroll-behavior: smooth;

  max-height: 300px;
  ${Scroll}
`

export const ListItem = styled.div<{ start: number }>`
  position: absolute;
  top: 0;
  left: 0;
  transform: translateY(${(props) => props.start}px);
  width: 100%;
  cursor: pointer;
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
