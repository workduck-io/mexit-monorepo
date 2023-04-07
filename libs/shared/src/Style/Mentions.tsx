import styled, { css } from 'styled-components'

import { CardShadow } from './Helpers'
import { BodyFont } from './Search'

export const SMentionRoot = styled.span<{ type?: 'mentionable' | 'invite' | 'self' }>`
  line-height: 1.2;
  background-color: ${({ theme }) => theme.tokens.surfaces.s[2]};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  ${({ type, theme }) =>
    type &&
    type === 'self' &&
    css`
      border-radius: ${({ theme }) => theme.borderRadius.tiny};
      border: 1px solid rgba(${theme.colors.secondary}, 0.5);
      box-shadow: 0 0 4px rgba(${theme.colors.secondary}, 0.25);
    `}
`

export const Username = styled.div`
  white-space: nowrap;
`

export const SAccessTag = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.tiny} ${theme.spacing.small}`};
  background-color: ${({ theme }) => theme.tokens.surfaces.s[3]};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  gap: ${({ theme }) => theme.spacing.tiny};
  font-size: 0.9rem;
`

export const MentionTooltipContent = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 200px;
  max-width: 200px;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.small};
`

export const MentionTooltip = styled.div<{ spotlight?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  max-height: 400px;
  /* max-width: 320px; */
  overflow-y: auto;
  ${CardShadow}
  background: ${({ theme }) => theme.tokens.surfaces.s[2]} !important;
  color: ${({ theme }) => theme.editor.elements.mention.default} !important;

  & > img,
  & > svg {
    width: 100%;
    aspect-ratio: 1;
    margin: 0;
  }

  &::after {
    border-right-color: ${({ theme }) => theme.tokens.colors.primary.default} !important;
  }

  ${({ spotlight }) =>
    spotlight &&
    css`
      flex-direction: row;
    `}
`

export const TooltipMail = styled.div`
  color: ${({ theme }) => theme.tokens.text.fade};
  ${BodyFont}
`

export const TooltipAlias = styled.div`
  ${BodyFont}
  color: ${({ theme }) => theme.tokens.colors.primary.default};
`

export const SMention = styled.div<{ selected: boolean; type: 'mentionable' | 'invite' | 'self' }>`
  display: inline-flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.tiny};
  padding: ${({ theme }) => `${theme.spacing.tiny} ${theme.spacing.small}`};

  svg,
  img {
    align-self: center;
    border-radius: ${({ theme }) => theme.borderRadius.large};
  }

  color: ${({ theme }) => theme.tokens.colors.secondary};
  ${({ selected, theme }) =>
    selected &&
    css`
      background-color: rgba(${theme.rgbTokens.colors.secondary}, 0.15);
      border-radius: ${theme.borderRadius.tiny};
    `}
  ${({ type, selected, theme }) =>
    type &&
    type === 'self' &&
    !selected &&
    css`
      background: -webkit-linear-gradient(
        60deg,
        ${theme.tokens.colors.secondary},
        rgba(${theme.rgbTokens.colors.primary.default}, 0.75)
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    `}
`
