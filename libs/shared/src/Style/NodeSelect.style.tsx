import styled, { css } from 'styled-components'

import { StyledNamespaceTag } from './NamespaceTag.style'
import { Input } from './ToggleButton'

export const Ellipsis = css`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const StyledInputWrapper = styled.div<{ isOverlay: boolean }>`
  width: 100%;
  position: relative;
  ${({ isOverlay, theme }) =>
    isOverlay
      ? css`
          margin: ${theme.spacing.small} 0;
        `
      : css`
          width: calc(100% - 5rem);
        `}

  ${Input} {
    width: 100%;
  }
`

export const StyledNodeSelectWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1px;
`

export const StyledCombobox = styled.div`
  display: flex;
  font-size: 1rem;
  align-items: center;
  flex-grow: 1;
  flex-shrink: 1;
  svg {
    margin-left: ${({ theme }) => theme.spacing.tiny};
    color: ${({ theme }) => theme.tokens.text.fade};
    &.errorIcon {
      color: ${({ theme }) => theme.tokens.colors.red};
    }
    &.okayIcon {
      color: ${({ theme }) => theme.tokens.colors.green};
    }
  }
`

export const FilterComboboxToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.small};
  padding: 0 ${({ theme }) => theme.spacing.small};
  background-color: ${({ theme }) => theme.tokens.surfaces.s[3]};

  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: ${({ theme }) => theme.tokens.text.fade};
  }
`

export const SuggestionContentWrapper = styled.div`
  width: 60%;
  flex-grow: 1;
`

export const SuggestionText = styled.div`
  flex-shrink: 1;
  ${Ellipsis}
`

export const SuggestionTextWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const SuggestionDesc = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.tiny};
  color: ${({ theme }) => theme.tokens.text.fade};
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

interface SuggestionProps {
  highlight: boolean
  center?: boolean
}

export const Suggestion = styled.li<SuggestionProps>`
  display: flex;
  align-items: ${({ center }) => (center ? 'center' : 'flex-start')};
  padding: ${({ theme }) => `${theme.spacing.small}`};
  margin: ${({ theme }) => `${theme.spacing.tiny} 0`};

  border-radius: ${({ theme }) => theme.borderRadius.tiny};

  & > .mexit-list-item {
    margin: ${({ theme }) => `0 ${theme.spacing.small} 0 ${theme.spacing.tiny}`};
    color: ${({ theme }) => theme.tokens.text.fade};
    flex-shrink: 0;
  }

  ${({ theme, highlight }) =>
    highlight &&
    css`
      background-color: ${theme.tokens.colors.primary.default};
      color: ${theme.tokens.colors.primary.text};
      .mexit-list-item {
        color: ${({ theme }) => theme.tokens.colors.primary.text};
      }
      ${SuggestionDesc} {
        color: rgba(${({ theme }) => theme.rgbTokens.colors.primary.text}, 0.5);
      }
      ${StyledNamespaceTag} {
        color: ${({ theme }) => theme.tokens.colors.primary.text};
        svg {
          color: ${({ theme }) => theme.tokens.colors.primary.text};
        }
      }
    `}
`

export const SuggestionError = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 10px 6px 4px;
  margin: ${({ theme }) => `${theme.spacing.small} 0`};
  gap: ${({ theme }) => theme.spacing.small};

  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  border: 1px dashed ${({ theme }) => theme.tokens.colors.red};
  background-color: rgba(${({ theme }) => theme.colors.palette.red}, 0.1);
  svg {
    color: ${({ theme }) => theme.tokens.colors.red};
  }
  ${SuggestionDesc} {
    white-space: initial;
    margin: ${({ theme }) => theme.spacing.small} 0;
  }
`

interface MenuProps {
  isOpen: boolean
  isOverlay: boolean
  highlightFirst: boolean
}

export const StyledMenu = styled.ul<MenuProps>`
  padding: ${({ theme }) => theme.spacing.small};
  margin-top: 8px;
  margin-bottom: 8px;
  width: 100%;
  max-height: 16.2rem;
  overflow-y: auto;
  overflow-x: hidden;
  outline: 0;
  transition: opacity 0.1s ease;
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  z-index: 1000;
  box-shadow: ${({ theme }) => theme.tokens.shadow.medium};

  ${({ isOverlay }) =>
    isOverlay
      ? css`
          position: absolute;
          background-color: ${({ theme }) => theme.generic.contextMenu.menu.surface};
        `
      : css`
          position: relative;
          width: 100%;
          height: 18rem;
          z-index: inherit;
          background-color: ${({ theme }) => theme.generic.noteSelect.menu.surface};
        `}

  ${({ isOpen }) =>
    !isOpen &&
    css`
      border: none;
      display: none;
    `}
`

export const StyledSpotlightInputWrapper = styled.div`
  width: 100%;
  position: relative;
  ${StyledMenu} {
    margin-top: ${({ theme }) => theme.spacing.medium};
  }
  ${Input} {
    color: ${({ theme }) => theme.tokens.text.fade};
    width: 100%;
    border: none;
  }
`
