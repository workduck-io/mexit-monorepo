import styled, { css } from 'styled-components'

import { Scroll } from '../../Style/Nav'

export const ListContainer = styled.div<{ maxHeight?: string }>`
  width: 100%;
  overflow: auto;
  position: relative;
  scroll-behavior: smooth;

  ${({ maxHeight = '300px' }) => css`
    max-height: ${maxHeight}px;
  `}

  ${Scroll}
`

export const ListItemContainer = styled.div<{ start: number }>`
  position: absolute;
  top: 0;
  left: 0;
  transform: translateY(${(props) => props.start}px);
  width: 100%;
  cursor: pointer;
`
