import styled, { css } from 'styled-components'

import { Button } from './Buttons'
import { BodyFont } from './Search'

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
      z-index: 9999999998;
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

export const ComboboxItemTitle = styled.div`
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

export const ActionTitle = styled.div`
  ${BodyFont};
  user-select: none;
  margin: 8px;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.text.heading};
`

export const ComboboxShortcuts = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  /* margin-top: 1rem; */
  padding: 0.5rem 0;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[8]};
`

export const ShortcutText = styled.div`
  margin-bottom: 2px;
  display: flex;
  justify-content: flex-end;

  .text {
    ${BodyFont};
    display: flex;
    align-items: center;
    margin-left: 4px;
    color: ${({ theme }) => theme.colors.text.fade};
  }
`
export const ComboSeperator = styled.div`
  margin-left: 0.5rem;

  section {
    height: 30vh !important;
    overflow-y: auto;
    overflow-x: hidden;
  }

  width: 300px;
`

export const StyledComboHeader = styled(ComboboxItem)`
  padding: 0.2rem 0;
  margin: 0.25rem 0;

  ${Button} {
    padding: 0.25rem;
    margin: 0 0.5rem 0;
  }
`
