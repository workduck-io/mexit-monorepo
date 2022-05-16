import styled, { css, keyframes } from 'styled-components'

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

export const FadeContainer = styled.div<{ fade: boolean }>`
  display: flex;
  flex: 1;
  animation: ${({ fade }) =>
    fade
      ? css`
          ${fadeIn} 0.25s ease-in-out
        `
      : ''};
`
