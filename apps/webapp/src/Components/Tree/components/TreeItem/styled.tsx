import styled, { css } from 'styled-components'

import { BodyFont } from '@mexit/shared'

export const TreeListItem = styled.li<{
  clone?: boolean
  ghost?: boolean
  indicator?: boolean
  disableSelection?: boolean
  active?: boolean
  isStub?: boolean
  isHighlighted?: boolean
  disableInteraction?: boolean
}>`
  list-style: none;
  box-sizing: border-box;
  padding: 0 ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding-left: var(--spacing);
  ${BodyFont}
  color: ${({ theme }) => theme.tokens.text.fade};

  ${({ isHighlighted, theme }) =>
    isHighlighted &&
    css`
      background: ${theme.sidebar.tree.item.wrapper.active.surface};
      color: ${theme.sidebar.tree.item.wrapper.active.textColor};
    `}

  ${({ isStub }) =>
    isStub &&
    css`
      opacity: 0.8;
      color: ${({ theme }) => theme.tokens.text.disabled};
      svg {
        color: ${({ theme }) => theme.tokens.text.disabled};
      }
      background-color: transparent;
    `}

  ${({ active, theme }) =>
    active
      ? css`
          background: ${theme.sidebar.tree.item.wrapper.active.surface};
          color: ${theme.tokens.text.default};
          font-weight: bold;
        `
      : css`
          :hover {
            background: ${({ theme }) => theme.sidebar.tree.item.wrapper.hover.surface};
          }
        `}

  ${({ disableSelection }) =>
    disableSelection &&
    css`
      user-select: none;
    `}
  ${({ disableInteraction }) =>
    disableInteraction &&
    css`
      pointer-events: none;
    `}
    ${({ clone }) =>
    clone &&
    css`
       {
        display: inline-block;
        pointer-events: none;
        padding: 0;
        padding-left: 10px;
        padding-top: 5px;

        .TreeItem {
          --vertical-padding: 5px;

          padding-right: 24px;
          border-radius: 4px;
          box-shadow: 0px 15px 15px 0 rgba(34, 33, 81, 0.1);
        }
      }
    `}
    ${({ ghost }) =>
    ghost &&
    css`
      &.indicator {
        opacity: 1;
        position: relative;
        z-index: 1;
        margin-bottom: -1px;

        .TreeItem {
          position: relative;
          padding: 0;
          height: 8px;
          border-color: #2389ff;
          background-color: #56a1f8;

          &:before {
            position: absolute;
            left: -8px;
            top: -4px;
            display: block;
            content: '';
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 1px solid #2389ff;
            background-color: #ffffff;
          }

          > * {
            /* Items are hidden using height and opacity to retain focus */
            opacity: 0;
            height: 0;
          }
        }
      }
    `};
`
