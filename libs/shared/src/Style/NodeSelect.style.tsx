import { transparentize } from 'polished'
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
    color: ${({ theme }) => theme.colors.text.fade};
    &.errorIcon {
      color: ${({ theme }) => theme.colors.palette.red};
    }
    &.okayIcon {
      color: ${({ theme }) => theme.colors.palette.green};
    }
  }
`

export const FilterComboboxToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.small};
  padding: 0 ${({ theme }) => theme.spacing.small};
  background-color: ${({ theme }) => transparentize(0.5, theme.colors.gray[7])};

  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: ${({ theme }) => theme.colors.text.fade};
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
  color: ${({ theme }) => theme.colors.text.fade};
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
    color: ${({ theme }) => theme.colors.gray[5]};
    flex-shrink: 0;
  }

  ${({ theme, highlight }) =>
    highlight &&
    css`
      background-color: ${theme.colors.primary};
      color: ${theme.colors.text.oppositePrimary};
      .mexit-list-item {
        color: ${({ theme }) => theme.colors.text.oppositePrimary};
      }
      ${SuggestionDesc} {
        color: ${({ theme }) => transparentize(0.25, theme.colors.text.oppositePrimary)};
      }
      ${StyledNamespaceTag} {
        color: ${({ theme }) => theme.colors.text.oppositePrimary};
        svg {
          color: ${({ theme }) => theme.colors.text.oppositePrimary};
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
  border: 1px dashed ${({ theme }) => theme.colors.palette.red};
  background-color: ${({ theme }) => transparentize(0.9, theme.colors.palette.red)};
  svg {
    color: ${({ theme }) => theme.colors.palette.red};
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
  background-color: ${({ theme }) => theme.colors.gray[8]};
  width: 100%;
  max-height: 16.2rem;
  overflow-y: auto;
  overflow-x: hidden;
  outline: 0;
  transition: opacity 0.1s ease;
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  z-index: 1000;
  box-shadow: 0 0 0 1px hsla(0, 0%, 0%, 0.1), 0 4px 11px hsla(0, 0%, 0%, 0.1);

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray[7]};
  }

  ${({ isOverlay }) =>
    isOverlay
      ? css`
          position: absolute;
        `
      : css`
          position: relative;
          width: 100%;
          height: 18rem;
          box-shadow: none;
          z-index: inherit;
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
    color: ${({ theme }) => theme.colors.text.fade};
    width: 100%;
    border: none;
  }
`
