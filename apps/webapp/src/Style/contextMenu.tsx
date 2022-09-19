import React from 'react'

import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'
import { mix } from 'polished'
import styled, { css } from 'styled-components'

/*
 * See https://www.radix-ui.com/docs/primitives/components/context-menu
 * for styling
 * */

export const ContextMenuContent = styled(ContextMenuPrimitive.Content)`
  min-width: 140px;
  background-color: ${({ theme }) => mix(0.5, theme.colors.gray[8], theme.colors.gray[7])};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  overflow: hidden;
  padding: 5px;
  box-shadow: 0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2);
`

export const ContextMenuItem = styled(ContextMenuPrimitive.Item)<{ color?: string }>`
  font-size: 14px;
  line-height: 1;
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  display: flex;
  align-items: center;
  gap: 5px;
  height: 25px;
  padding: 0px 5px;
  position: relative;
  padding-left: 5px;
  user-select: none;
  color: ${({ theme }) => theme.colors.text.default};

  &:focus,
  &:hover {
    background-color: ${({ theme }) => mix(0.5, theme.colors.gray[8], theme.colors.gray[9])};
    ${({ color }) =>
      !color &&
      css`
        color: ${({ theme }) => theme.colors.text.heading};
        svg {
          color: ${({ theme }) => theme.colors.primary};
        }
      `}
  }
  &[data-disabled] {
    color: ${({ theme }) => theme.colors.text.disabled};
    pointer-events: none;
  }

  ${({ color }) =>
    color &&
    css`
      color: ${color};
      svg {
        fill: ${color};
      }
    `}
`

export const ContextMenuSeparator = styled(ContextMenuPrimitive.Separator)`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.gray[6]};
  margin: 5px;
`
