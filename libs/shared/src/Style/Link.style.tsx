import { Relative } from '@mexit/shared'
import { Button } from '@workduck-io/mex-components'
import styled from 'styled-components'
import { transparentize } from 'polished'

export const LinkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.small};
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
    color: ${({ theme }) => theme.colors.text.fade};
  }
`

export const LinkTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.small};
  align-items: center;
  width: max-content;

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

  ${Button} {
    opacity: 0.5;
    color: ${({ theme }) => theme.colors.palette.red};
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
  justify-content: space-between;
  align-items: center;

  width: 100%;

  gap: ${({ theme }) => theme.spacing.small};

  ${Button} {
    padding: ${({ theme }) => theme.spacing.tiny} ${({ theme }) => theme.spacing.small};
    gap: ${({ theme }) => theme.spacing.tiny};
  }
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

export const HighlightGroupToggleButton = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.tiny};
  align-items: center;
  cursor: pointer;
  background: ${({ theme }) => transparentize(0.5, theme.colors.gray[7])};
  padding: ${({ theme }) => theme.spacing.tiny} ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`

export const HighlightCount = styled.div`
  color: ${({ theme }) => theme.colors.text.heading};
  font-weight: 600;
`

export const HighlightCollapsedToggle = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.tiny};
  align-items: center;
  width: max-content;
  color: ${({ theme }) => theme.colors.text.fade};
`

export const HighlightGroupHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  padding-left: ${({ theme }) => theme.spacing.medium};

  gap: ${({ theme }) => theme.spacing.tiny};
  color: ${({ theme }) => theme.colors.text.fade};
`

export const HighlightGroupsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.large};
  padding: ${({ theme }) => theme.spacing.small} 0;
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
  background-color: ${({ theme }) => transparentize(0.9, theme.colors.gray[5])};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
`
