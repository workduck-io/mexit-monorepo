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
  z-index: 10;
  background: ${({ theme, transparent }) => (transparent ? 'transparent' : theme.colors.gray[9])};
  color: ${({ theme }) => theme.colors.text.default};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  text-align: left;
  width: max-content;
  max-width: 600px;
  transform-origin: center right;
  animation: ${scale} 0.3s;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
`
