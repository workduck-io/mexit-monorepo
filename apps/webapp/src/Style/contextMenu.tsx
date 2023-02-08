import styled, { css } from 'styled-components'

import { generateStyle } from '@workduck-io/mex-themes'

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

export const ContextMenuItem = styled.div<{ color?: string; selected?: boolean }>`
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
