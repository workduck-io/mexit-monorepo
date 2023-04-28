import styled, { css } from 'styled-components'

import { Button } from '@workduck-io/mex-components'

import { Relative } from '../Components/RelativeTime'

import { BodyFont } from './Search'

export const Links = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.tokens.text.default};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 0;
  background: none;
`

export const LinkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};
`

export const LinkHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  width: 100%;

  :hover {
    cursor: pointer;
    color: ${({ theme }) => theme.tokens.colors.primary.hover};
  }

  gap: ${({ theme }) => theme.spacing.small};

  ${Relative} {
    color: ${({ theme }) => theme.tokens.text.fade};
  }
`

export const LinkTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.small};
  align-items: center;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* number of lines to show */
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  img {
    border-radius: 50%;
  }
`

export const LinkMetadataAndDelete = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.small};
  align-items: center;
  white-space: nowrap;

  ${Button} {
    opacity: 0.5;
    color: ${({ theme }) => theme.tokens.colors.red};
  }

  ${BodyFont}

  &:hover {
    ${Button} {
      opacity: 1;
    }
  }
`

export const LinkShortenAndTagsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.small};
`

export const LinkShortenAndHighlightSection = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.medium};
  align-items: center;
`

export const LinkTagSection = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.small};
  align-items: center;
`

export const HighlightGroupToggleButton = styled(Button)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  ${BodyFont}
  box-shadow: none;
  svg {
    flex-shrink: 0;
  }
`

export const HighlightCount = styled.div`
  ${BodyFont};
  color: ${({ theme }) => theme.tokens.text.heading};
  font-weight: 600;
`

export const HighlightCollapsedToggle = styled(Button)`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.tiny};
  align-items: center;
  width: max-content;
  color: ${({ theme }) => theme.tokens.text.fade};
  box-shadow: none;
  ${BodyFont}
`

export const FooterFlexButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  ${BodyFont}

  gap: ${({ theme }) => theme.spacing.tiny};
  padding: ${({ theme }) => theme.spacing.small};

  :hover {
    cursor: pointer;
    color: ${({ theme }) => theme.tokens.text.default};
    background: ${({ theme }) => theme.tokens.surfaces.s[3]};
  }
`

export const HighlightText = styled.div`
  ${BodyFont}
  color: ${({ theme }) => theme.tokens.text.default};
`

export const VerticalSeperator = styled.span`
  height: 1em;
  width: 1px;
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  background: ${({ theme }) => theme.tokens.surfaces.s[3]};
`

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => `rgba(${theme.rgbTokens.surfaces.s[4]}, 0.8)`};
  backdrop-filter: blur(10px);
`

export const HighlightNoteLink = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  color: ${({ theme }) => theme.tokens.text.fade};

  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.tokens.text.heading};
  }
`

export const HighlightGroupHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  gap: ${({ theme }) => theme.spacing.tiny};
  color: ${({ theme }) => theme.tokens.text.fade};

  cursor: pointer;
  user-select: none;
  &:hover {
    color: ${({ theme }) => theme.tokens.colors.primary.default};
  }
`

export const HighlightGroupsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
`

export const LinkedNotesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
`

export const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.small};
`

export const HighlightGroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
`

export const SingleHighlightWrapper = styled.div<{ padding?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  background-color: ${({ theme }) => theme.tokens.surfaces.s[3]};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  user-select: none;
  flex-shrink: 0;
  ${({ padding, theme }) =>
    padding &&
    css`
      padding: ${theme.spacing.small};
    `}
  overflow: hidden;
`

export const HighlightNotes = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow: hidden auto;
  margin-top: ${({ theme }) => theme.spacing.medium};
`

export const HighlightNote = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};

  box-sizing: border-box;
  width: 100%;
  ${BodyFont}
  cursor: pointer;

  color: ${({ theme }) => theme.tokens.text.fade};

  &:hover {
    background: ${({ theme }) => theme.sidebar.tree.item.wrapper.active.surface};
    color: ${({ theme }) => theme.tokens.text.default};
  }
`
