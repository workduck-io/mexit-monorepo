import styled, { css } from 'styled-components'

export const ComboboxRoot = styled.ul<{ isOpen: boolean }>`
  ${({ isOpen, theme }) =>
    isOpen &&
    css`
      top: -9999px;
      left: -9999px;
      position: absolute;
      padding: 0;
      margin: 0;
      z-index: 11;
      background: ${theme.colors.background.modal};
      width: 300px;
      border-radius: 8px;
      box-shadow: rgba(0, 0, 0, 0.133) 0 3.2px 7.2px 0, rgba(0, 0, 0, 0.11) 0 0.6px 1.8px 0;
    `}
`

export const ItemTitle = styled.div``
export const ItemRightIcons = styled.div`
  display: flex;
  flex-gap: ${({ theme }) => theme.spacing.tiny};
`

export const ItemDesc = styled.div`
  margin-top: ${({ theme }) => theme.spacing.tiny};
  color: ${({ theme }) => theme.colors.text.fade};
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
export const ItemCenterWrapper = styled.div`
  width: 90%;
`

export const ComboboxItem = styled.div<{ highlighted: boolean }>`
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
  color: ${({ theme }) => theme.colors.text.subheading};
  background: ${({ highlighted, theme }) => (!highlighted ? 'transparent' : theme.colors.background.highlight)};
  cursor: pointer;

  :hover {
    background-color: ${({ theme }) => theme.colors.background.highlight};
  }

  & > svg {
    color: ${({ theme }) => theme.colors.gray[4]};
  }
`
export const BodyFont = css`
  font-size: 12px;
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
