import { transparentize } from 'polished'
import styled, { css } from 'styled-components'

import { CardShadow } from '@mexit/shared'

export const SMentionRoot = styled.div`
  display: inline-block;
  line-height: 1.2;
  background-color: ${({ theme }) => theme.colors.gray[8]};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
`

export const Username = styled.div`
  padding: ${({ theme }) => theme.spacing.tiny};
`

export const SAccessTag = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.tiny} ${theme.spacing.small}`};
  background-color: ${({ theme }) => transparentize(0.5, theme.colors.gray[9])};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  gap: ${({ theme }) => theme.spacing.tiny};
  font-size: 0.9rem;
`

export const MentionTooltip = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  max-height: 400px;
  max-width: 700px;
  overflow-y: auto;
  ${CardShadow}
  background: ${({ theme }) => theme.colors.gray[8]} !important;
  color: ${({ theme }) => theme.colors.text.default};
  img,
  svg {
    border-radius: ${({ theme }) => theme.borderRadius.large};
  }
  &::after {
    border-right-color: ${({ theme }) => theme.colors.primary} !important;
  }
`

export const TooltipMail = styled.div`
  color: ${({ theme }) => theme.colors.text.fade};
  font-size: 0.9rem;
`

export const SMention = styled.div<{ selected: boolean }>`
  color: ${({ theme }) => theme.colors.secondary};
  ${({ selected, theme }) =>
    selected &&
    css`
      background-color: ${transparentize(0.75, theme.colors.secondary)};
      border-radius: ${theme.borderRadius.tiny};
    `}
`
