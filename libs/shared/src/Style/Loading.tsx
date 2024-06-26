import React from 'react'

import styled, { css, keyframes } from 'styled-components'

import { range } from '@mexit/core'

const loadingFade = keyframes`
  0% { opacity: 0; }
  50% { opacity: 0.8; }
  100% { opacity: 0; }
`

export const LoadingWrapper = styled.div<LoadingProps>`
  display: flex;
  justify-content: space-around;
  ${({ theme, transparent }) =>
    !transparent &&
    css`
      padding: 10px;
      background: ${theme.tokens.surfaces.s[4]};
    `}

  border-radius: 5px;

  max-width: ${({ dots }) => `${dots * 24}px`};
`

const LoadingDot = styled.div<{ totalDots: number; color?: string }>`
  width: 8px;
  height: 8px;
  margin: 0 4px;
  ${({ theme, color }) =>
    color
      ? css`
          background: ${color};
          box-shadow: 0 2px 8px ${color};
        `
      : css`
          background: ${theme.tokens.colors.primary.default};
          box-shadow: 0 2px 8px ${theme.tokens.colors.primary.default};
        `}

  border-radius: 50%;

  opacity: 0;

  animation: ${loadingFade} 1s infinite;

  ${({ totalDots }) =>
    range(totalDots).reduce((prev, d) => {
      return css`
        ${prev};
        &:nth-child(${d + 1}) {
          animation-delay: ${d * 0.1}s;
        }
      `
    }, css``)}
`

export interface LoadingProps {
  dots: number
  transparent?: boolean
  color?: string
}

const Loading = ({ dots, transparent, color }: LoadingProps) => {
  return (
    <LoadingWrapper transparent={transparent} dots={dots}>
      {Array(dots)
        .fill(0)
        .map((e, i) => (
          <LoadingDot color={color} totalDots={dots} key={`loadingDot${i}`}></LoadingDot>
        ))}
    </LoadingWrapper>
  )
}

export { Loading }
