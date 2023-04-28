import React, { useRef } from 'react'

import { getPreventDefaultHandler } from '@udecode/plate'
import styled, { css } from 'styled-components'

import { MIcon } from '@mexit/core'

import { Tooltip } from '../FloatingElements'

type BallonOptionsUnwrapperProps = {
  id: string
  icon?: MIcon
  active: string
  color?: string
  onClick: (id: string) => void
  children: React.ReactNode[]
}

const BallonOptionContainer = styled.div<{ length?: number; active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.tiny};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  transition: width 0.25s ease, background 0.25s ease, transform 0.25s ease;

  ${({ active, length, theme }) =>
    active
      ? css`
          width: calc(${length * 2}rem + 2rem);
          background: ${theme.tokens.surfaces.s[3]};
          transform: scale(1.1) translateY(-0.5rem);
          transform-origin: 100% 0;
          box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
          margin: 0 ${theme.spacing.small};
        `
      : css`
          width: 2rem;
          transform: scale(1) translateY(0);
          box-shadow: none;
          background: none;

          :hover {
            background: ${theme.tokens.surfaces.s[3]};
          }
        `}

  cursor: pointer;
  gap: ${({ theme }) => theme.spacing.small};
`

const StyledOption = styled.span<{ index?: number; active?: boolean; isMiddleActive?: boolean }>`
  ${({ isMiddleActive }) =>
    isMiddleActive &&
    css`
      pointer-events: none;
    `}

  ${({ active }) =>
    active
      ? css`
          display: inline-block;
        `
      : css`
          display: none;
        `}
`

export const BallonOptionsUnwrapper: React.FC<BallonOptionsUnwrapperProps> = ({
  id,
  icon,
  children,
  active,
  color,
  onClick
}) => {
  const isActive = active === id
  const ref = useRef<HTMLDivElement | null>(null)

  const handleOnClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    onClick(id)
  }

  return (
    <Tooltip content={isActive ? null : id} root={document.getElementById(id)}>
      <BallonOptionContainer
        ref={ref}
        onClick={getPreventDefaultHandler()}
        onMouseDown={handleOnClick}
        id={id}
        length={children.length}
        active={isActive}
      >
        {React.Children.map(children, (child, i) => {
          const isMiddleElement = i === Math.floor(children.length / 2)

          return (
            <StyledOption
              key={`${id}-${i}-${isActive}`}
              isMiddleActive={isMiddleElement && !isActive}
              active={isMiddleElement || isActive}
              index={i}
            >
              {child}
            </StyledOption>
          )
        })}
      </BallonOptionContainer>
    </Tooltip>
  )
}
