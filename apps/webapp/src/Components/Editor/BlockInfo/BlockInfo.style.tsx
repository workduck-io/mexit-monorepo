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

export const BlockInfoWrapper = styled.div`
  background: ${({ theme }) => theme.colors.gray[7]};
  z-index: 20;
  color: ${({ theme }) => theme.colors.text.default};
  pointer-events: none;
  border-radius: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.tiny};
  font-size: 14px;
  animation: ${scale} 0.2s;
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
`

export const BlockInfoBlockWrapper = styled.div`
  position: relative;
  user-select: none;
`
