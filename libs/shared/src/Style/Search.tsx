import { animated } from 'react-spring'

import styled, { css } from 'styled-components'

import { ViewType } from '@mexit/core'

import { EditorHeader, EditorStyles } from './Editor'
import { Input } from './Form'
import { CardShadow } from './Helpers'
import { DataGroup, MetadataWrapper } from './Metadata'
import { StyledNamespaceTag } from './NamespaceTag.style'
import { Ellipsis, StyledInputWrapper } from './NodeSelect.style'
import { size } from './Responsive'
import { TagFlex } from './TagsRelated.styles'
import { Title, TitleText } from './Typography'
import { ProfileIcon } from './UserPage'

interface ResultProps {
  selected?: boolean
}

export const MainFont = css`
  font-size: 16px;
`

export const BodyFont = css`
  font-size: 14px;
`

const SearchTransition = css`
  transition: all 0.2s ease-in-out;
`

const SearchHeight = css`
  height: calc(100vh - ${({ theme }) => (theme.additional.hasBlocks ? '2rem' : '0rem')} - 16rem);
`

const iconStyle = (primary?: boolean) => css`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  & > svg {
    height: 1.5rem;
    width: 1.5rem;
    color: ${({ theme }) => (primary ? theme.tokens.colors.primary.default : theme.tokens.text.fade)};
  }
`
export const InputWrapper = styled.div<{ transparent?: boolean }>`
  width: 100%;
  ${({ transparent }) =>
    transparent &&
    css`
      background-color: ${({ theme }) => theme.tokens.surfaces.s[1]};
      /* padding: ${({ theme }) => `${theme.spacing.tiny} ${theme.spacing.small}`}; */
      border-radius: ${({ theme }) => theme.borderRadius.small};
      margin-bottom: ${({ theme }) => theme.spacing.medium};
    `}
`

export const SearchInput = styled(Input)`
  width: 100%;
  max-width: 20rem;
  transition: all 0.25s ease-in-out;
`

export const SearchHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.tokens.surfaces.s[2]};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};
  ${InputWrapper} {
    display: flex;
    align-items: center;
    padding: 0 ${({ theme }) => theme.spacing.small};
    background: ${({ theme }) => theme.tokens.surfaces.s[3]};
    border-radius: ${({ theme }) => theme.borderRadius.small};
    border: 1px solid transparent;
    box-shadow: ${({ theme }) => theme.tokens.shadow.small};
    transition: all 0.2s ease-in-out;
    width: max-content;

    ${Input} {
      flex-grow: 1;
      background: transparent;
      border: none !important;
      color: ${({ theme }) => theme.tokens.text.default};

      width: 20rem;
      transition: all 0.2s ease-in-out;
      &:active,
      &:focus {
        width: 30rem;
      }
    }

    &:hover {
      background: ${({ theme }) => theme.generic.form.input.hover.surface};
      box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
    }

    &:focus-within {
      border: 1px solid ${({ theme }) => theme.tokens.colors.primary.default};
      box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
    }

    svg {
      flex-shrink: 0;
    }
  }
`

export const SearchFilterWrapper = styled(SearchHeader)`
  background-color: rgba(${({ theme }) => theme.rgbTokens.surfaces.s[2]}, 0.5);
  flex-grow: 1;
  justify-content: flex-start;
`

export const SearchFiltersWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.tiny};
`

export const SearchFilterCategoryLabel = styled.div`
  color: ${({ theme }) => theme.tokens.text.fade};
  padding: ${({ theme }) => `${theme.spacing.small} 0`};
`

export const SearchFilterLabel = styled.div`
  flex-shrink: 1;
  display: flex;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  ${iconStyle(true)};
  color: ${({ theme }) => theme.tokens.text.fade};
`

export const SearchFilterListWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing.small};
  margin-right: ${({ theme }) => theme.spacing.medium};
  max-width: 70vw;
  overflow-x: auto;
`

export const SearchFilterListCurrent = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing.medium};
`

export const SearchFilterListSuggested = styled(SearchFilterListCurrent)`
  justify-content: space-between;
`

export const SearchFilterList = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border: 1px solid rgba(${({ theme }) => theme.rgbTokens.surfaces.s[2]}, 0.5);
  border-radius: ${({ theme }) => theme.borderRadius.small};
`

export const SearchFilterCancel = styled.div`
  cursor: pointer;
  display: flex;
  padding: ${({ theme }) => ` ${theme.spacing.tiny}`};
  transition: all 0.25s ease-in-out;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};

  border-radius: ${({ theme }) => theme.borderRadius.tiny};

  background-color: ${({ theme }) => theme.tokens.surfaces.s[2]};
  transition: all 0.25s ease-in-out;
  color: ${({ theme }) => theme.tokens.colors.red};

  svg {
    height: 1.5rem;
    width: 1.5rem;
    opacity: 1;
  }

  &:hover {
    color: ${({ theme }) => theme.tokens.colors.black};
    background-color: ${({ theme }) => theme.tokens.colors.red};
    svg {
      opacity: 1;
    }
  }
`
export const SearchFilterStyled = styled.div<{ selected?: boolean }>`
  cursor: pointer;
  display: flex;
  padding: ${({ theme }) => `${theme.spacing.tiny} ${theme.spacing.small}`};
  transition: all 0.25s ease-in-out;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};

  border-radius: ${({ theme }) => theme.borderRadius.small};

  background-color: ${({ theme }) => theme.tokens.surfaces.s[2]};
  transition: all 0.25s ease-in-out;

  width: max-content;

  svg {
    height: 1rem;
    width: 1rem;
    opacity: 0.66;
  }

  &:hover {
    background-color: ${({ theme }) => theme.tokens.surfaces.s[3]};
    svg {
      opacity: 1;
    }
  }
  ${({ selected }) =>
    selected &&
    css`
      background-color: ${({ theme }) => theme.tokens.colors.primary.default};
      color: ${({ theme }) => theme.tokens.colors.primary.text};

      svg {
        color: ${({ theme }) => theme.tokens.colors.primary.text};
      }

      &:hover {
        background-color: rgba(${({ theme }) => theme.rgbTokens.colors.primary.default}, 0.6);
        color: ${({ theme }) => theme.tokens.colors.primary.text};
        svg {
          color: ${({ theme }) => theme.tokens.colors.primary.text};
          opacity: 1;
        }
      }
    `}
`

export const SearchFilterCount = styled.div`
  background-color: ${({ theme }) => theme.tokens.surfaces.s[2]};
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.tokens.colors.primary.default};
  padding: ${({ theme }) => `${theme.spacing.tiny} ${theme.spacing.tiny}`};
  border-radius: 2rem;
  min-width: 1.35rem;
  text-align: center;
`

export const SearchViewContainer = styled.div`
  position: relative;
  margin: ${({ theme: { spacing } }) => `${spacing.large}`};
  display: flex;
  gap: ${({ theme }) => theme.spacing.medium};
  flex-direction: column;
`

export const SearchContainer = styled.div`
  margin: ${({ theme: { spacing } }) => `calc(2 * ${spacing.large}) ${spacing.large} ${spacing.medium}`};
  position: relative;
  min-height: 60vh;
`

export const NoSearchResults = styled.div`
  width: 100%;
  height: 3rem;
  font-size: 1.2rem;
  padding: ${({ theme }) => theme.spacing.medium};
  color: ${({ theme }) => theme.tokens.text.fade};
  position: absolute;
  top: 0;
`

export const ResultCardFooter = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
  background-color: ${({ theme }) => theme.tokens.surfaces.s[2]};
  border-top: 1px solid ${({ theme }) => theme.tokens.surfaces.s[3]};
  padding: ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.tokens.text.fade};
  ${TagFlex} {
    background: ${({ theme }) => theme.tokens.surfaces.s[3]};
    :hover {
      background: ${({ theme }) => theme.tokens.colors.primary.default};
    }
  }
  ${({ theme, active }) =>
    active &&
    css`
      color: ${theme.tokens.colors.primary.default};
    `}
`
export const ResultRow = styled.div<{ active?: boolean; selected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing.medium};
  padding: ${({ theme }) => `0.5rem ${theme.spacing.medium}`};
  color: ${({ theme }) => theme.tokens.text.fade};
  width: 100%;
  ${SearchTransition}

  & > svg {
    ${SearchTransition}
    height: 1.35rem;
    width: 1.35rem;
    color: ${({ theme }) => theme.tokens.colors.fade};
  }
  ${({ theme, selected }) =>
    selected &&
    css`
      & > svg {
        color: ${theme.tokens.colors.primary.default};
      }
    `}
`

export const ResultMain = styled.div`
  justify-self: flex-start;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.tiny};
`

export const ResultTitle = styled.div`
  ${MainFont};
  ${SearchTransition}
  display: flex;
  gap: ${({ theme }) => theme.spacing.tiny};

  color: ${({ theme }) => theme.tokens.text.default};
`

export const ResultHeader = styled.div<{ active?: boolean; $paddingSize?: 'small' | 'default' }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.tokens.surfaces.s[3]};
  padding: ${({ theme, $paddingSize }) => ($paddingSize === 'small' ? theme.spacing.small : theme.spacing.medium)};
  color: ${({ theme }) => theme.tokens.text.fade};
  gap: ${({ theme }) => theme.spacing.small};
  ${ResultTitle} {
    flex-grow: 1;
  }
  ${({ theme, active }) =>
    active &&
    css`
      color: ${theme.tokens.colors.primary.default};

      ${ResultTitle} {
        color: ${theme.tokens.colors.primary.default};
      }
    `}
`

export const ResultDesc = styled.div`
  flex-shrink: 1;
  color: ${({ theme }) => theme.tokens.text.fade};
  font-size: ${BodyFont};
  max-width: 20rem;

  ${Ellipsis}
`
export const ResultPreviewMetaData = styled.div`
  ${MetadataWrapper} {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.tiny};
  }
`
export const ResultMetaData = styled.div`
  display: flex;
  flex-shrink: 1;
  align-items: center;
  justify-content: flex-end;
  font-size: 0.9rem;
  ${DataGroup} {
    min-width: 15rem;
  }
  ${ProfileIcon} {
    opacity: 0.66;
  }
`

export const Result = styled(animated.div)<{ selected?: boolean; view?: ViewType }>`
  background-color: ${({ theme }) => theme.tokens.surfaces.s[2]};
  :hover {
    cursor: pointer;
  }
  ${({ theme, selected, view }) => {
    if (view === ViewType.Card) {
      return css`
        max-height: 400px;
        overflow-y: auto;
        border: 1px solid transparent !important;
        display: flex;
        flex-direction: column;
        box-shadow: ${theme.tokens.shadow.small};

        ${SearchPreviewWrapper} {
          max-height: 300px;
          height: 300px;
          overflow: hidden;
          flex-grow: 1;
        }

        ${selected &&
        css`
          ${CardShadow}
          border: 1px solid ${theme.tokens.colors.primary.default} !important;
          /* ${ResultTitle} {
            font-weight: bold;
            color: ${theme.tokens.colors.primary.default};
          } */
        `}
        :hover {
          cursor: pointer;
          ${CardShadow}
          border: 1px solid ${theme.tokens.colors.primary.default} !important;
        }
      `
    } else if (view === ViewType.List) {
      return css`
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        flex-shrink: 0;
        width: 100%;
        border: 1px solid transparent;
        transition: 0.3s ease;
        overflow: visible;
        :hover {
          transition: 0s ease;
          background-color: ${theme.tokens.surfaces.s[2]};
          border: 1px solid ${theme.tokens.colors.primary.default} !important;

          ${ResultTitle} {
            font-weight: bold;
            color: ${theme.tokens.colors.primary.default};
          }
        }
        ${selected &&
        css`
          transition: 0s ease;
          background-color: ${theme.tokens.surfaces.s[2]};
          border: 1px solid ${theme.tokens.colors.primary.default} !important;

          ${ResultTitle} {
            font-weight: bold;
            color: ${theme.tokens.colors.primary.default};
          }
        `}
      `
    } else return ``
  }}
  border-radius: ${({ theme }) => theme.borderRadius.small};
  ${SearchTransition}
`

export const Results = styled.div<{ view: ViewType }>`
  ${SearchHeight}
  overflow-y: auto;
  ${({ theme, view }) => {
    if (view === ViewType.Card) {
      return css`
        display: grid;
        grid-gap: ${theme.spacing.large};
        grid-auto-rows: min-content;
        grid-auto-flow: row;

        @media (min-width: ${size.medium}) {
          grid-template-columns: repeat(3, 1fr);
        }

        @media (max-width: ${size.medium}) {
          grid-template-columns: repeat(2, 1fr);
        }

        @media (max-width: ${size.small}) {
          grid-template-columns: repeat(1, 1fr);
        }
      `
    } else if (view === ViewType.List) {
      return css`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: ${theme.spacing.tiny};
        flex-grow: 1;
      `
    } else return ``
  }}
`

export const ResultsWrapper = styled.div`
  position: relative;
`

export const ItemTag = styled.div<{ large?: boolean }>`
  height: 100%;
  padding: 0.2rem ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  background-color: ${({ theme }) => theme.tokens.surfaces.s[2]};
  color: ${({ theme }) => theme.tokens.text.fade};
  font-size: 0.9rem;
  font-weight: normal;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  svg {
    color: ${({ theme }) => theme.tokens.text.default};
  }
  ${({ large }) =>
    large &&
    css`
      padding: 0.25rem ${({ theme }) => theme.spacing.small};
      font-size: 1rem;
    `}
`

export const SearchPreviewWrapper = styled.div<{ active?: boolean; padding?: boolean }>`
  ${({ padding }) =>
    padding &&
    css`
      padding: ${({ theme }) => theme.spacing.medium};
    `}
`

export const SearchFilterInputWrapper = styled(StyledInputWrapper)`
  max-width: 12rem;
  margin: 0;
`

export const SearchIndexValue = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};

  background-color: ${({ theme }) => theme.tokens.surfaces.s[2]};
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};

  svg:first-child {
    color: ${({ theme }) => theme.tokens.colors.primary.default};
  }
`
export const SplitSearchPreviewWrapper = styled.div`
  ${SearchHeight}
  overflow-y: auto;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  background-color: ${({ theme }) => theme.tokens.surfaces.s[1]};
  padding: ${({ theme }) => theme.spacing.medium};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.large};
  box-shadow: ${({ theme }) => theme.tokens.shadow.medium};

  ${EditorHeader} {
    background: none;
    padding: 0;
  }

  ${EditorStyles} {
    font-size: 1rem;
    border-radius: ${({ theme }) => theme.borderRadius.small};
    max-height: 40vh;
    overflow-x: hidden;
    overflow-y: auto;
    min-height: 30vh;

    background-color: ${({ theme }) => theme.tokens.surfaces.s[2]};
    box-shadow: ${({ theme }) => theme.tokens.shadow.small};
  }

  ${MetadataWrapper} {
    font-size: 0.8rem;
    margin: 0;
  }

  ${Title} {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({ theme }) => theme.spacing.small};
    flex-wrap: wrap;
    cursor: pointer;
    margin: 0;
    .title,
    ${TitleText} {
      display: flex;
      align-items: center;
      gap: ${({ theme }) => theme.spacing.small};
      padding: 0.75rem 0;
      flex-grow: 1;
      ${StyledNamespaceTag} {
        font-size: 1rem;
        font-weight: 500;
        svg {
          width: 1rem;
          height: 1rem;
        }
      }
    }
    & > svg {
      color: ${({ theme }) => theme.tokens.colors.primary.default};
    }
  }
`

export const SSearchHighlights = styled.div`
  padding: ${({ theme }) => theme.spacing.medium};
`

export const HighlightWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  padding: ${({ theme }) => theme.spacing.tiny};

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const TitleHighlightWrapper = styled.div`
  margin-bottom: 0;
`

export const Highlight = styled.span`
  padding: ${({ theme: { spacing } }) => `${spacing.tiny} ${spacing.small}`};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.tokens.colors.primary.default};
  color: ${({ theme }) => theme.tokens.colors.primary.text};
`

export const MatchCounterWrapper = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.tokens.text.fade};
  font-size: 0.9rem;
`
export const MatchCounter = styled.div`
  margin-left: ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.tokens.colors.primary.default};
  font-size: 1.2rem;
`
