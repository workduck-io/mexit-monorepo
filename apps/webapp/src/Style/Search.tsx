import { EditorStyles, TagFlex, CardShadow } from '@mexit/shared'
import { transparentize } from 'polished'
import { animated } from 'react-spring'
import styled, { css } from 'styled-components'
import { DataGroup, MetadataWrapper } from '../Components/EditorInfobar/Metadata'
import { StyledInputWrapper } from '../Components/NodeSelect/NodeSelect.styles'
import { View } from '../Views/ViewSelector'
import { Title } from './Elements'
import { Input } from './Form'
import { size } from './Responsive'
import { ProfileIcon } from './UserPage'

interface ResultProps {
  selected?: boolean
}

export const MainFont = css`
  font-size: 14px;
`

export const BodyFont = css`
  font-size: 12px;
`

export const Ellipsis = css`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const SearchTransition = css`
  transition: all 0.2s ease-in-out;
`

const SearchHeight = css`
  height: calc(100vh - 22rem);
`

const iconStyle = (primary?: boolean) => css`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  svg {
    height: 1.5rem;
    width: 1.5rem;
    color: ${({ theme }) => (primary ? theme.colors.primary : theme.colors.gray[9])};
  }
`
export const InputWrapper = styled.div`
  width: 100%;
  ${iconStyle(true)};
`

export const SearchInput = styled(Input)`
  width: 100%;
  max-width: 20rem;
  transition: all 0.25s ease-in-out;
  &:focus {
    max-width: 30rem;
  }
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
  flex-wrap: wrap;
  gap: ${({ theme }) => `${theme.spacing.tiny} ${theme.spacing.large}`};
`

export const SearchFilterCategoryLabel = styled.div`
  color: ${({ theme }) => theme.colors.text.fade};
  margin: 0 ${({ theme }) => theme.spacing.small} 0 ${({ theme }) => theme.spacing.medium};
`

export const SearchFilterLabel = styled.div`
  ${iconStyle(true)}
  color: ${({ theme }) => theme.colors.text.fade};
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
  gap: ${({ theme }) => theme.spacing.small};
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

export const SearchFilterCancel = styled.div`
  cursor: pointer;
  display: flex;
  padding: ${({ theme }) => ` ${theme.spacing.small}`};
  transition: all 0.25s ease-in-out;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  margin-left: ${({ theme }) => theme.spacing.large};

  border-radius: ${({ theme }) => theme.borderRadius.tiny};

  background-color: ${({ theme }) => theme.colors.gray[8]};
  transition: all 0.25s ease-in-out;

  svg {
    opacity: 0.66;
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

  svg {
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

      &:hover {
        background-color: ${({ theme }) => transparentize(0.4, theme.colors.primary)};
        color: ${({ theme }) => theme.colors.text.oppositePrimary};
        svg {
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

        ${SearchPreviewWrapper} {
          max-height: 300px;
          overflow: hidden;
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
        ${selected &&
        css`
          transition: 0s ease;
          background-color: ${theme.colors.gray[8]};
          border: 1px solid ${theme.colors.primary} !important;

          max-height: 400px;
          overflow-y: auto;
          ${ResultTitle} {
            font-weight: bold;
            color: ${theme.colors.primary};
          }
        `}
      `
    }
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
      `
    } else if (view === View.List) {
      return css`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: ${theme.spacing.tiny};
        flex-grow: 1;
      `
    }
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

export const SearchPreviewWrapper = styled.div<{ active?: boolean }>`
  ${({ theme, active }) => active && css``}
`

export const SearchFilterInputWrapper = styled(StyledInputWrapper)`
  max-width: 12rem;
  margin: 0;
`

export const SplitSearchPreviewWrapper = styled.div`
  height: calc(100vh - 22rem);
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
    .title {
      flex-grow: 1;
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
