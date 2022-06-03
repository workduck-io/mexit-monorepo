import styled, { css } from 'styled-components'

export const ComboboxItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  gap: ${({ theme }) => theme.spacing.tiny};

  :first-child {
    border-radius: 6px 6px 0 0;
  }

  :last-child {
    border-radius: 0 0 6px 6px;
  }

  font-weight: 400;
  padding: 0 8px;
  min-height: 36px;
  user-select: none;
  width: 300px;
  color: ${({ theme }) => theme.colors.text.default};
  &.highlight {
    background: ${({ theme }) => theme.colors.background.highlight};
  }
  cursor: pointer;

  :hover {
    background-color: ${({ theme }) => theme.colors.background.highlight};
  }

  & > svg {
    color: ${({ theme }) => theme.colors.gray[4]};
  }
`
export const ComboboxRoot = styled.div<{ isOpen: boolean }>`
  :hover {
    ${ComboboxItem} {
      &.highlight {
        &:hover {
        }
      }
    }
  }
  /* &.reversed {
    transform: rotate(180deg);
    ${ComboboxItem} {
      transform: rotate(-180deg);
    }
  } */

  ${({ isOpen, theme }) =>
    isOpen &&
    css`
      top: -9999px;
      left: -9999px;
      position: absolute;
      padding: 0;
      background: none !important;
      display: flex;
      margin: 0;
      z-index: 11;
      height: fit-content;

      > div {
        background: ${theme.colors.background.modal};
        height: fit-content;
        /* max-height: 400px; */
        box-shadow: rgba(0, 0, 0, 0.133) 0 3.2px 7.2px 0, rgba(0, 0, 0, 0.11) 0 0.6px 1.8px 0;
        border-radius: ${theme.borderRadius.small};

        > section {
          max-height: 30vh;
          overflow-y: auto;
          overflow-x: hidden;
        }
      }
    `}
`

export const ItemTitle = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  /* width: 200px; */
`

export const ItemRightIcons = styled.div`
  display: flex;
  flex-gap: ${({ theme }) => theme.spacing.tiny};
`

export const ItemDesc = styled.div`
  margin: ${({ theme }) => theme.spacing.tiny} 0;
  color: ${({ theme }) => theme.colors.text.fade};
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
export const ItemCenterWrapper = styled.div`
  width: 90%;
`
