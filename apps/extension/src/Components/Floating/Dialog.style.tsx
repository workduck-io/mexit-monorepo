import styled from 'styled-components'
import { transparentize } from 'polished'

import { FloatingOverlay } from '@floating-ui/react-dom-interactions'

export const DialogOverlay = styled(FloatingOverlay)`
  display: grid;
  place-items: center;
  background: ${({ theme }) => transparentize(0.25, theme.colors.gray[10])};
  backdrop-filter: blur(10px);
`
