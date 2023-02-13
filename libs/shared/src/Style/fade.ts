import styled, { css, keyframes } from 'styled-components'

export const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

export const fadeOut = keyframes`
  0%{
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`

export const FadeContainer = styled.section<{ fade: boolean }>`
  display: flex;
  flex: 1;
  animation: ${({ fade }) =>
    fade
      ? css`
          ${fadeIn} 0.25s ease-in-out
        `
      : ''};
`
