import { transparentize } from 'polished'
import styled, { css } from 'styled-components'

export const OutlineWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.small};
`
export const OutlineIconWrapper = styled.div``

export const OutlineItemText = styled.div<{ level?: number; heading?: boolean }>`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const OutlineItemRender = styled.div<{ level?: number; heading?: boolean }>`
  color: ${({ theme }) => theme.colors.text.default};
  padding-left: ${({ theme }) => theme.spacing.small};
  display: flex;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
  font-size: 0.9rem;

  ${({ heading }) =>
        heading &&
        css`
      font-weight: 500;
    `}
  ${({ level, heading, theme }) =>
        level &&
        css`
      margin-left: ${heading ? (level - 1) * 8 : (level - 1) * 12}px;
      padding: ${0.1 + (heading ? 0.067 * (7 - level) : 0)}rem ${theme.spacing.small} 0rem;
      font-size: ${heading ? 0.8 + 0.057 * (7 - level) : 0.9}rem;
      opacity: ${1 - 0.067 * level};
    `}

  svg {
    transition: 0.3s ease;
    min-width: 16px;
    min-height: 16px;
    color: ${({ theme }) => transparentize(0.5, theme.colors.text.fade)};
  }

  ${OutlineIconWrapper} {
    transition: 0.3s ease;
    font-size: 0.9rem;
    color: ${({ theme }) => transparentize(0.5, theme.colors.text.fade)};
  }
  transition: 0.3s ease;
  &:hover {
    transition: 0s ease;
    color: ${({ theme }) => theme.colors.primary};
    ${OutlineIconWrapper} {
      transition: 0s ease;
      color: ${({ theme }) => theme.colors.text.fade};
    }
    svg {
      transition: 0s ease;
      color: ${({ theme }) => theme.colors.text.fade};
    }
  }
`
