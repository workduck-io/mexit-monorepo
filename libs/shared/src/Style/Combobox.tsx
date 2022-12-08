import styled, { css } from 'styled-components'

import { Button } from './Buttons'
import { BodyFont } from './Search'

export const ComboboxItem = styled.div<{ center?: boolean }>`
  display: flex;
  align-items: ${({ center }) => (center ? 'center' : 'flex-start')};
  gap: ${({ theme }) => theme.spacing.small};

  font-weight: 400;
  font-size: 14px;
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  /* min-height: 36px; */
  user-select: none;
  margin: 0 ${({ theme }) => theme.spacing.small};
  width: 260px;
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

export const CenteredIcon = styled.span<{ center?: boolean; padding?: boolean }>`
  ${({ theme, center }) =>
    center &&
    css`
      display: flex;
      align-items: center;
      justify-content: center;
    `}

  border-radius: ${({ theme }) => theme.borderRadius.small};
`

export const ItemsContainer = styled.section`
  padding-bottom: ${({ theme }) => theme.spacing.small};

  /* padding: ${({ theme }) => theme.spacing.small}; */
`

export const SectionSeparator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.background.highlight};
  margin: ${({ theme }) => theme.spacing.medium} 0;
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

  ${({ isOpen, theme }) =>
    isOpen &&
    css`
      top: -9999px;
      left: -9999px;
      position: absolute;
      padding: 0;
      /* background: none !important; */
      display: flex;
      margin: 0;
      z-index: 9999999998;
      height: fit-content;

      > div {
        background: ${theme.colors.background.modal};
        box-shadow: rgba(0, 0, 0, 0.133) 0 3.2px 7.2px 0, rgba(0, 0, 0, 0.11) 0 0.6px 1.8px 0;
        border-radius: ${theme.borderRadius.small};

        > section {
          max-height: 30vh;
          overflow-y: auto;
          overflow-x: hidden;
        }
      }

      #List {
        height: fit-content;
      }
    `}
`

export const ComboboxItemTitle = styled.div<{ margin?: boolean }>`
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 22ch;
  overflow: hidden;
`

export const ItemRightIcons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.tiny};
`

export const ItemDesc = styled.div`
  /* margin: ${({ theme }) => theme.spacing.tiny} 0; */
  color: ${({ theme }) => theme.colors.text.disabled};
  font-size: 12px;
  max-width: 28ch;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const ItemCenterWrapper = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  gap: ${({ theme }) => theme.spacing.tiny};
  height: 100%;
`

export const ActionTitle = styled.div`
  font-size: 11px;
  user-select: none;
  margin: ${({ theme }) => `${theme.spacing.medium} ${theme.spacing.medium}`};
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.text.disabled};
  text-transform: uppercase;
`

export const ComboboxShortcuts = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 0.5rem 0;
  width: 100%;
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

export const ComboSeperator = styled.div<{ fixedWidth?: boolean }>`
  margin-left: 0.5rem;

  section {
    height: 30vh !important;
    overflow-y: auto;
    overflow-x: hidden;
  }

  ${({ fixedWidth }) =>
    fixedWidth &&
    css`
      width: 300px;
    `}
`

export const StyledComboHeader = styled(ComboboxItem)`
  padding: 0;
  margin-top: 0.25rem;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.highlight};

  :hover {
    background: transparent;
  }

  ${Button} {
    padding: 0.25rem;
    margin: 0 0.5rem 0;
  }
`
