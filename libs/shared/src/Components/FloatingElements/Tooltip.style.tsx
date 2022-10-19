import styled, { keyframes } from 'styled-components'

const scale = keyframes`
  from {
    transform: scale(0.5);
    opacity: 0.5;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
`

export const TooltipWrapper = styled.div`
  background: ${({ theme }) => theme.colors.gray[7]};
  z-index: 20;
  color: ${({ theme }) => theme.colors.text.default};
  pointer-events: none;
  border-radius: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.small};
  font-size: 14px;
  animation: ${scale} 0.2s;
`
