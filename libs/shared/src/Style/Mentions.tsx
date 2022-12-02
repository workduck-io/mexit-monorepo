import { mix,transparentize } from 'polished'
import styled, { css } from 'styled-components'

import { CardShadow } from './Helpers'

export const SMentionRoot = styled.div<{ type?: 'mentionable' | 'invite' | 'self' }>`
  display: inline-block;
  line-height: 1.2;
  background-color: ${({ theme }) => theme.colors.gray[8]};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  ${({ type, theme }) =>
    type &&
    type === 'self' &&
    css`
      border-radius: ${({ theme }) => theme.borderRadius.tiny};
      border: 1px solid ${transparentize(0.5, theme.colors.secondary)};
      box-shadow: 0 0 4px ${transparentize(0.75, theme.colors.secondary)};
    `}
`

export const Username = styled.div``

export const SAccessTag = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.tiny} ${theme.spacing.small}`};
  background-color: ${({ theme }) => transparentize(0.5, theme.colors.gray[6])};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  gap: ${({ theme }) => theme.spacing.tiny};
  font-size: 0.9rem;
`

export const MentionTooltipContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.small};
`

export const MentionTooltip = styled.div<{ spotlight?: boolean }>`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  max-height: 400px;
  max-width: 700px;
  overflow-y: auto;
  ${CardShadow}
  background: ${({ theme }) => theme.colors.gray[8]} !important;
  color: ${({ theme }) => theme.colors.text.default};
  & > img,
  & > svg {
    width: 100%;
    height: 100%;
  }
  &::after {
    border-right-color: ${({ theme }) => theme.colors.primary} !important;
  }

  ${({ spotlight }) =>
    spotlight &&
    css`
      flex-direction: row;
    `}
`

export const TooltipMail = styled.div`
  color: ${({ theme }) => theme.colors.text.fade};
  font-size: 0.9rem;
`

export const TooltipAlias = styled.div`
  color: ${({ theme }) => theme.colors.primary};
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

  color: ${({ theme }) => theme.colors.secondary};
  ${({ selected, theme }) =>
    selected &&
    css`
      background-color: ${transparentize(0.75, theme.colors.secondary)};
      border-radius: ${theme.borderRadius.tiny};
    `}
  ${({ type, selected, theme }) =>
    type &&
    type === 'self' &&
    !selected &&
    css`
      background: -webkit-linear-gradient(
        60deg,
        ${theme.colors.secondary},
        ${mix(0.25, theme.colors.secondary, theme.colors.primary)}
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    `}
`
