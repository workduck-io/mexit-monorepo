import styled, { keyframes } from 'styled-components'

import { generateStyle } from '@workduck-io/mex-themes'

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
  ${({ theme }) => generateStyle(theme.generic.tooltip.default)};
  z-index: 20;
  pointer-events: none;
  border-radius: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.small};
  font-size: 14px;
  animation: ${scale} 0.2s;
  box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
`
