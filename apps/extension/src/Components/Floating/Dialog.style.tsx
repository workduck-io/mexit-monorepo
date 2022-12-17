import { FloatingOverlay } from '@floating-ui/react-dom-interactions'
import styled from 'styled-components'

export const DialogOverlay = styled(FloatingOverlay)`
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.tokens.surfaces.s[3]};
  backdrop-filter: blur(10px);
`
