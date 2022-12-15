import styled, { css } from 'styled-components'

import { Button } from '@workduck-io/mex-components'

import { HoverSubtleGlow, SubtleGlow } from '@mexit/shared'

export const SBackLinks = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 3rem 0;
`

export const NodeLinkWrapper = styled.div`
  padding-bottom: ${({ theme }) => theme.spacing.small};
  background: none;
`

export const NodeLinkTitleWrapper = styled.div<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};

  svg {
    flex-shrink: 0;
  }
`

export const NodeLinkStyled = styled.div<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.small};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  margin-bottom: ${({ theme }) => theme.spacing.small};
  background: ${({ theme }) => theme.tokens.surfaces.s[3]};
  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};
  svg {
    fill: ${({ theme }) => theme.tokens.text.fade};
    width: 16px;
    height: 16px;
  }
  ${Button} {
    padding: ${({ theme }) => theme.spacing.tiny};
    box-shadow: none;
  }
  &:hover {
    ${Button} {
      color: ${({ theme }) => theme.tokens.colors.primary.text};
      &:hover {
        color: ${({ theme }) => theme.tokens.colors.primary.default};
      }
    }
  }
  ${({ selected, theme }) =>
    selected
      ? css`
          background: ${theme.tokens.colors.primary.default};
          color: ${theme.tokens.colors.primary.text};
          ${SubtleGlow}
          svg {
            fill: ${theme.tokens.colors.primary.text};
          }
        `
      : css`
          &:nth-child(2n + 1) {
            background: rgba(${theme.rgbTokens.surfaces.s[2]}, 0.5);
          }
          ${HoverSubtleGlow}
        `}
`

export const DataInfoHeader = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.tokens.text.subheading};
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.medium};

  svg {
    margin-right: ${({ theme }) => theme.spacing.small};
    color: ${({ theme }) => theme.tokens.colors.primary.default};
  }
`
