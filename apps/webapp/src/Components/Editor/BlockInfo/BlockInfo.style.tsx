import { Button } from '@workduck-io/mex-components'
import styled, { keyframes } from 'styled-components'

const scale = keyframes`
  from {
    transform: translate(50%) scale(0.5);
    opacity: 0.5;
  }

  to {
    transform: translate(100%) scale(1);
    opacity: 1;
  }
`

export const BlockInfoWrapper = styled.div`
  background: ${({ theme }) => theme.colors.gray[9]};
  z-index: 20;
  color: ${({ theme }) => theme.colors.text.default};
  border-radius: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.tiny} ${({ theme }) => theme.spacing.small};
  font-size: 14px;
  animation: ${scale} 0.2s;
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  transform: translate(100%, 0%);
`

export const BlockInfoBlockWrapper = styled.div`
  position: relative;
  user-select: none;
`

export const BlockInfoButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing.tiny};
  svg {
    width: 16px;
    height: 16px;
  }
`
