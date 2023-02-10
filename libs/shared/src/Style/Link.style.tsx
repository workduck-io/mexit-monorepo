import styled from 'styled-components'

import { Button } from '@workduck-io/mex-components'

import { Relative } from '../Components/RelativeTime'

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
  /* justify-content: space-between; */
  width: 100%;
  height: 100%;
  gap: ${({ theme }) => theme.spacing.medium};
  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};
`

export const LinkHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  width: 100%;

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

  font-size: 1.2rem;

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
  color: ${({ theme }) => theme.tokens.text.fade};
  font-size: 1rem;
  box-shadow: none;
  svg {
    flex-shrink: 0;
  }
`

export const HighlightCount = styled.div`
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
  font-size: 1rem;
  box-shadow: none;
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

export const HighlightText = styled.div``

export const HighlightGroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
`

export const SingleHighlightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.small};
  background-color: ${({ theme }) => theme.tokens.surfaces.s[3]};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  user-select: none;
`

export const HighlightNotes = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.tiny};
`

export const HighlightNote = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  cursor: pointer;

  color: ${({ theme }) => theme.tokens.text.fade};

  &:hover {
    color: ${({ theme }) => theme.tokens.colors.primary.default};
  }
`
