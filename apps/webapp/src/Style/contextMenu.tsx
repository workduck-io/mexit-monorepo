import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'
import styled, { css } from 'styled-components'

import { generateStyle } from '@workduck-io/mex-themes'

/*
 * See https://www.radix-ui.com/docs/primitives/components/context-menu
 * for styling
 * */

const ContextMenuContentStyles = css`
  z-index: 1000;
  min-width: 140px;
  ${({ theme }) => generateStyle(theme.generic.contextMenu.menu)}
  overflow: hidden;
  padding: 5px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
  border: 1px solid ${({ theme }) => theme.tokens.surfaces.s[3]};
`

export const ContextMenuSubContent = styled(ContextMenuPrimitive.SubContent)`
  ${ContextMenuContentStyles}
`

export const ContextMenuContent = styled(ContextMenuPrimitive.Content)`
  ${ContextMenuContentStyles}
`

const itemStyles = css`
  font-size: 14px;
  line-height: 1;
  display: flex;
  align-items: center;
  gap: 5px;
  height: 25px;
  padding: 0px 5px;
  position: relative;
  padding-left: 5px;
  user-select: none;
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  ${({ theme }) => generateStyle(theme.generic.contextMenu.item)}
  transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  svg {
    transition: color 0.2s ease-in-out;
  }

  &:focus,
  &:hover {
    svg {
      color: ${({ theme }) => theme.tokens.colors.primary.default};
    }
  }
  &[data-disabled] {
    color: ${({ theme }) => theme.tokens.text.disabled};
    pointer-events: none;
  }
`

export const ContextMenuItem = styled(ContextMenuPrimitive.Item)<{ color?: string; selected?: boolean }>`
  ${itemStyles}

  &:focus,
  &:hover {
    ${({ color }) =>
      !color &&
      css`
        color: ${({ theme }) => theme.tokens.text.heading};
        svg {
          color: ${({ theme }) => theme.tokens.colors.primary.default};
        }
      `}
  }

  ${({ color }) =>
    color &&
    css`
      color: ${color};
      svg {
        color: ${color};
      }
      :hover {
        color: ${color};
        svg {
          color: ${color};
        }
      }
    `}

  ${({ selected, theme }) =>
    selected &&
    css`
      ${({ theme }) => generateStyle(theme.generic.contextMenu.item.selected)}
      svg {
        color: ${theme.tokens.colors.primary.default};
      }
    `}
`

export const ContextMenuSubTrigger = styled(ContextMenuPrimitive.SubTrigger)<{ color?: string }>`
  ${itemStyles}

  &[data-state="open"] {
    background-color: ${({ theme }) => theme.tokens.surfaces.s[3]};
    color: ${({ theme }) => theme.tokens.text.heading};
    svg {
      color: ${({ theme }) => theme.tokens.colors.primary.default};
    }
  }
`

export const RightSlot = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  padding-left: 20px;
  color: ${({ theme }) => theme.tokens.text.fade};
  [data-highlighted] > & {
    color: 'white';
  }
  [data-disabled] & {
    color: ${({ theme }) => theme.tokens.text.disabled};
  }
`

export const ContextMenuSeparator = styled(ContextMenuPrimitive.Separator)`
  height: 1px;
  background-color: ${({ theme }) => theme.tokens.surfaces.separator};
  margin: 5px;
`
