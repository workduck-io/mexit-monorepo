import styled, { css } from 'styled-components'

import { Input } from '../../Style/Form'
import { transparentize } from 'polished'

export const StyledInputWrapper = styled.div`
  width: 100%;
  position: relative;
  margin: ${({ theme }) => theme.spacing.small} 0;
  ${Input} {
    width: 100%;
  }
`

export const StyledCombobox = styled.div`
  display: flex;
  width: 100%;
  font-size: 1rem;
  align-items: center;
  svg {
    margin-left: ${({ theme }) => theme.spacing.small};
    color: ${({ theme }) => theme.colors.text.fade};
    &.errorIcon {
      color: ${({ theme }) => theme.colors.palette.red};
    }
    &.okayIcon {
      color: ${({ theme }) => theme.colors.palette.green};
    }
  }
`

export const SuggestionContentWrapper = styled.div`
  width: 90%;
`
export const SuggestionText = styled.div``
export const SuggestionDesc = styled.div`
  margin-top: ${({ theme }) => theme.spacing.tiny};
  color: ${({ theme }) => theme.colors.text.fade};
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

interface SuggestionProps {
  highlight: boolean
}

export const Suggestion = styled.li<SuggestionProps>`
  display: flex;
  align-items: center;
  padding: 6px 10px 6px 4px;
  margin: ${({ theme }) => `${theme.spacing.tiny} 0`};

  border-radius: ${({ theme }) => theme.borderRadius.tiny};

  & > svg {
    margin-right: 6px;
    color: ${({ theme }) => theme.colors.gray[5]};
    flex-shrink: 0;
  }

  ${({ theme, highlight }) =>
    highlight &&
    css`
      background-color: ${theme.colors.primary};
      color: ${theme.colors.text.oppositePrimary};
      & > svg {
        color: ${({ theme }) => theme.colors.text.oppositePrimary};
      }
      ${SuggestionDesc} {
        color: ${({ theme }) => transparentize(0.25, theme.colors.text.oppositePrimary)};
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
  highlightFirst: boolean
}

export const StyledMenu = styled.ul<MenuProps>`
  padding: ${({ theme }) => theme.spacing.small};
  margin-top: 8px;
  margin-bottom: 8px;
  position: absolute;
  background-color: ${({ theme }) => theme.colors.gray[8]};
  width: 100%;
  max-height: 16.2rem;
  overflow-y: auto;
  overflow-x: hidden;
  outline: 0;
  transition: opacity 0.1s ease;
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  /* border: 1px solid ${({ theme }) => theme.colors.gray[7]}; */
  z-index: 1000;
  box-shadow: 0 0 0 1px hsla(0, 0%, 0%, 0.1), 0 4px 11px hsla(0, 0%, 0%, 0.1);

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray[7]};
  }

  ${({ isOpen }) =>
    !isOpen &&
    css`
      border: none;
      display: none;
    `}/* ${({ highlightFirst, theme }) =>
    highlightFirst &&
    css`
      ${Suggestion}:first-child {
        background-color: ${theme.colors.gray[7]};
      }
    `} */
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
