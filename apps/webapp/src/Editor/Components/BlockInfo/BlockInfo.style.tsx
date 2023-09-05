import styled, { css, keyframes } from 'styled-components'

import { Button } from '@workduck-io/mex-components'

const scale = keyframes`
  from {
    transform:  scale(0.75);
    opacity: 0.5;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
`

export const BlockInfoWrapper = styled.div<{ animate?: boolean }>`
  z-index: 5;
  color: ${({ theme }) => theme.tokens.text.default};
  border-radius: ${({ theme }) => theme.spacing.small};
  font-size: 14px;
  position: relative;
  user-select: none;
  ${({ animate }) =>
    animate
      ? css`
          animation: ${scale} 0.2s;
          opacity: 1;
        `
      : css`
          opacity: 0;
        `}

  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
`

export const BlockInfoBlockWrapper = styled.div`
  position: relative;
  user-select: none;
`

export const BlockInfoButton = styled(Button)`
  background: none;
  box-shadow: none;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  padding: ${({ theme }) => theme.spacing.tiny};
  svg {
    width: 16px;
    height: 16px;
  }
`
