import { Button } from '@workduck-io/mex-components'
import styled, { css, keyframes } from 'styled-components'

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

export const BlockInfoWrapper = styled.div<{ animate?: boolean }>`
  background: ${({ theme }) => theme.colors.gray[9]};
  z-index: 5;
  color: ${({ theme }) => theme.colors.text.default};
  border-radius: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.tiny} ${({ theme }) => theme.spacing.small};
  font-size: 14px;
  ${({ animate }) =>
    animate
      ? css`
          animation: ${scale} 0.2s;
          opacity: 1;
        `
      : css`
          opacity: 0;
        `}
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
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  padding: ${({ theme }) => theme.spacing.tiny};
  svg {
    width: 16px;
    height: 16px;
  }
`
