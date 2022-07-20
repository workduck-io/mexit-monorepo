import { animated } from 'react-spring'
import styled, { css } from 'styled-components'

import { Scroll } from '@mexit/shared'

export const StyledResults = styled(animated.div)`
  overflow: hidden auto;
  color: ${({ theme }) => theme.colors.text.fade};
`

export const List = styled.div`
  width: 100%;
  overflow: auto;
  position: relative;
  scroll-behavior: smooth;

  max-height: 425px;
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
  text-transform: uppercase;
  font-size: 0.75em;
  opacity: 0.5;
`
