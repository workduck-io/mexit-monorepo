import styled, { keyframes } from 'styled-components'

const scale = keyframes`
  from {
    transform: scale(0.5);
    opacity: 0.25;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
`

interface PopoverWrapperProps {
  transparent?: boolean
}
export const PopoverWrapper = styled.div<PopoverWrapperProps>`
  z-index: 10001;
  background: ${({ theme, transparent }) => (transparent ? 'transparent' : theme.tokens.surfaces.s[2])};
  color: ${({ theme }) => theme.tokens.text.default};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  text-align: left;
  width: max-content;
  max-width: 600px;
  transform-origin: center right;
  animation: ${scale} 0.3s;
  box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
  outline: none;
  border: none;
`
