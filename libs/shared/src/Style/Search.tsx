import { animated } from 'react-spring'

import { View } from '../Style/ViewSelector'
import { EditorStyles } from './Editor'
import { Input } from './Form'
import { CardShadow } from './Helpers'
import { DataGroup, MetadataWrapper } from './Metadata'
import { StyledNamespaceTag } from './NamespaceTag.style'
import { Ellipsis, StyledInputWrapper } from './NodeSelect.style'
import { size } from './Responsive'
import { TagFlex } from './TagsRelated.styles'
import { Title, TitleText } from './Typography'
import { ProfileIcon } from './UserPage'
import { transparentize } from 'polished'
import styled, { css } from 'styled-components'

interface ResultProps {
  selected?: boolean
}

export const MainFont = css`
  font-size: 14px;
`

export const BodyFont = css`
  font-size: 12px;
`

const SearchTransition = css`
  transition: all 0.2s ease-in-out;
`

const SearchHeight = css`
  height: calc(100vh - ${({ theme }) => (theme.additional.hasBlocks ? '2rem' : '0rem')} - 22rem);
`

const iconStyle = (primary?: boolean) => css`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  & > svg {
    height: 1.5rem;
    width: 1.5rem;
    color: ${({ theme }) => (primary ? theme.colors.primary : theme.colors.gray[9])};
  }
`
export const InputWrapper = styled.div<{ transparent?: boolean }>`
  width: 100%;
  ${({ transparent }) =>
    transparent &&
    css`
      background-color: ${({ theme }) => theme.colors.gray[8]};
      padding: ${({ theme }) => `${theme.spacing.tiny} ${theme.spacing.small}`};
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
  background-color: ${({ theme }) => theme.colors.gray[9]};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};
`

export const SearchFilterWrapper = styled(SearchHeader)`
  flex-grow: 1;
  justify-content: flex-start;
`

export const SearchFiltersWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: ${({ theme }) => `${theme.spacing.tiny} ${theme.spacing.large}`};
`

export const SearchFilterCategoryLabel = styled.div`
  color: ${({ theme }) => theme.colors.text.fade};
  padding: ${({ theme }) => `${theme.spacing.small} 0`};
`

export const SearchFilterLabel = styled.div`
  flex-shrink: 1;
  display: flex;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  ${iconStyle(true)};
  color: ${({ theme }) => theme.colors.text.fade};
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
  gap: ${({ theme }) => theme.spacing.small};
`

export const SearchFilterListSuggested = styled(SearchFilterListCurrent)``

export const SearchFilterList = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border: 1px solid ${({ theme }) => transparentize(0.5, theme.colors.gray[7])};
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

  background-color: ${({ theme }) => theme.colors.gray[8]};
  transition: all 0.25s ease-in-out;
  color: ${({ theme }) => theme.colors.palette.red};

  svg {
    height: 1.5rem;
    width: 1.5rem;
    opacity: 1;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.palette.black};
    background-color: ${({ theme }) => theme.colors.palette.red};
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

  background-color: ${({ theme }) => theme.colors.gray[8]};
  transition: all 0.25s ease-in-out;

  width: max-content;

  svg {
    height: 1rem;
    width: 1rem;
    opacity: 0.66;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[7]};
    svg {
      opacity: 1;
    }
  }
  ${({ selected }) =>
    selected &&
    css`
      background-color: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.text.oppositePrimary};

      svg {
        color: ${({ theme }) => theme.colors.text.oppositePrimary};
      }

      &:hover {
        background-color: ${({ theme }) => transparentize(0.4, theme.colors.primary)};
        color: ${({ theme }) => theme.colors.text.oppositePrimary};
        svg {
          color: ${({ theme }) => theme.colors.text.oppositePrimary};
          opacity: 1;
        }
      }
    `}
`

export const SearchFilterCount = styled.div`
  background-color: ${({ theme }) => theme.colors.gray[8]};
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
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
  color: ${({ theme }) => theme.colors.text.fade};
  position: absolute;
  top: 0;
`

export const ResultCardFooter = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
  background-color: ${({ theme }) => transparentize(0.5, theme.colors.gray[9])};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[8]};
  padding: ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.colors.text.fade};
  ${TagFlex} {
    background: ${({ theme }) => transparentize(0.5, theme.colors.gray[7])};
    :hover {
      background: ${({ theme }) => theme.colors.primary};
    }
  }
  ${({ theme, active }) =>
    active &&
    css`
      color: ${theme.colors.primary};
    `}
`
export const ResultRow = styled.div<{ active?: boolean; selected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing.medium};
  padding: ${({ theme }) => `0.5rem ${theme.spacing.medium}`};
  color: ${({ theme }) => theme.colors.text.fade};
  width: 100%;
  ${SearchTransition}

  & > svg {
    ${SearchTransition}
    height: 1.35rem;
    width: 1.35rem;
    color: ${({ theme }) => theme.colors.gray[5]};
  }
  ${({ theme, selected }) =>
    selected &&
    css`
      & > svg {
        color: ${theme.colors.primary};
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

  color: ${({ theme }) => theme.colors.text.default};
`

export const ResultHeader = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.gray[8]};
  padding: ${({ theme }) => theme.spacing.medium};
  color: ${({ theme }) => theme.colors.text.fade};
  gap: ${({ theme }) => theme.spacing.small};
  ${ResultTitle} {
    flex-grow: 1;
  }
  ${({ theme, active }) =>
    active &&
    css`
      color: ${theme.colors.primary};

      ${ResultTitle} {
        color: ${theme.colors.primary};
      }
    `}
`

export const ResultDesc = styled.div`
  flex-shrink: 1;
  color: ${({ theme }) => theme.colors.gray[5]};
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

export const Result = styled(animated.div)<{ selected?: boolean; view?: View }>`
  background-color: ${({ theme }) => theme.colors.gray[9]};
  :hover {
    cursor: pointer;
  }
  ${({ theme, selected, view }) => {
    if (view === View.Card) {
      return css`
        max-height: 400px;
        overflow-y: auto;
        border: 1px solid transparent !important;
        display: flex;
        flex-direction: column;

        ${SearchPreviewWrapper} {
          max-height: 300px;
          overflow: hidden;
          flex-grow: 1;
        }

        ${selected &&
        css`
          ${CardShadow}
          border: 1px solid ${theme.colors.primary} !important;
          ${ResultTitle} {
            font-weight: bold;
            color: ${theme.colors.primary};
          }
        `}
        :hover {
          cursor: pointer;
          ${CardShadow}
          border: 1px solid ${theme.colors.primary} !important;
        }
      `
    } else if (view === View.List) {
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
          background-color: ${theme.colors.gray[8]};
          border: 1px solid ${theme.colors.primary} !important;

          ${ResultTitle} {
            font-weight: bold;
            color: ${theme.colors.primary};
          }
        }
        ${selected &&
        css`
          transition: 0s ease;
          background-color: ${theme.colors.gray[8]};
          border: 1px solid ${theme.colors.primary} !important;

          ${ResultTitle} {
            font-weight: bold;
            color: ${theme.colors.primary};
          }
        `}
      `
    } else return ``
  }}
  border-radius: ${({ theme }) => theme.borderRadius.small};
  ${SearchTransition}
`

export const Results = styled.div<{ view: View }>`
  ${SearchHeight}
  overflow-y: auto;
  ${({ theme, view }) => {
    if (view === View.Card) {
      return css`
        display: grid;
        grid-gap: ${theme.spacing.large};
        grid-auto-rows: min-content;
        grid-auto-flow: row;

        @media (max-width: ${size.wide}) {
          grid-template-columns: repeat(2, 1fr);
        }

        @media (min-width: ${size.wide}) {
          grid-template-columns: repeat(3, 1fr);
        }

        @media (max-width: ${size.small}) {
          grid-template-columns: repeat(1, 1fr);
        }
      `
    } else if (view === View.List) {
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
  background-color: ${({ theme }) => theme.colors.gray[9]};
  color: ${({ theme }) => theme.colors.text.fade};
  font-size: 0.9rem;
  font-weight: normal;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  svg {
    color: ${({ theme }) => theme.colors.text.default};
  }
  ${({ large }) =>
    large &&
    css`
      padding: 0.25rem ${({ theme }) => theme.spacing.small};
      font-size: 1rem;
    `}
`

export const SearchPreviewWrapper = styled.div<{ active?: boolean; padding?: boolean }>`
  ${({ theme, active }) => active && css``}

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

  background-color: ${({ theme }) => theme.colors.gray[8]};
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};

  svg:first-child {
    color: ${({ theme }) => theme.colors.primary};
  }
`
export const SplitSearchPreviewWrapper = styled.div`
  ${SearchHeight}
  overflow-y: auto;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  background-color: ${({ theme }) => transparentize(0.5, theme.colors.gray[9])};
  padding: 0 ${({ theme }) => theme.spacing.medium};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.large};

  ${EditorStyles} {
    font-size: 1rem;
    border-radius: ${({ theme }) => theme.borderRadius.small};
    max-height: 40vh;
    overflow-x: hidden;
    overflow-y: auto;
    min-height: 30vh;

    background-color: ${({ theme }) => transparentize(0.5, theme.colors.gray[8])};
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
      color: ${({ theme }) => theme.colors.primary};
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
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text.oppositePrimary};
`

export const MatchCounterWrapper = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text.fade};
  font-size: 0.9rem;
`
export const MatchCounter = styled.div`
  margin-left: ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.2rem;
`
