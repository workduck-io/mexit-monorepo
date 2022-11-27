import { FloatingOverlay } from '@floating-ui/react-dom-interactions'
import { transparentize } from 'polished'
import styled from 'styled-components'

export const DialogOverlay = styled(FloatingOverlay)`
  display: grid;
  place-items: center;
  background: ${({ theme }) => transparentize(0.25, theme.colors.gray[10])};
  backdrop-filter: blur(10px);
`
