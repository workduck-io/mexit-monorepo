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

export const FadeContainer = styled.section<{ fade: boolean; flex?: boolean }>`
  ${({ flex = true }) =>
    flex &&
    css`
      display: flex;
      flex: 1;
    `}

  animation: ${({ fade }) =>
    fade
      ? css`
          ${fadeIn} 0.25s ease-in-out
        `
      : ''};
`

export const FadeSpan = styled.span`
  color: ${({ theme }) => theme.tokens.text.fade} !important;
  animation: ${fadeIn} 0.25s ease-in-out;
`
