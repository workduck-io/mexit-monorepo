import { Icon } from '@iconify/react'
import styled, { css } from 'styled-components'
import { transparentize } from 'polished'

export const SILinkRoot = styled.div`
  display: inline-block;
  line-height: 1.2;
`

interface SILinkProps {
  $selected: boolean
  $archived?: boolean
}

export const StyledIcon = styled(Icon)`
  margin-right: 4px;
`

export const SILink = styled.div<SILinkProps>`
  display: inline-flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
  ${StyledIcon} {
    color: ${({ theme }) => transparentize(0.3, theme.colors.primary)};
  }
  .ILink_decoration {
    color: ${({ theme }) => theme.colors.gray[6]};
    &_left {
    }
    &_right {
      margin-left: ${({ theme }) => theme.spacing.tiny};
    }
    &_value {
      color: ${({ theme }) => theme.colors.primary};
    }
  }

  ${({ theme, $selected }) =>
    $selected
      ? css`
          color: ${theme.colors.primary};
          background-color: ${theme.colors.gray[8]};
          border-radius: ${({ theme }) => theme.borderRadius.tiny};
          .ILink_decoration {
            color: ${({ theme }) => theme.colors.gray[4]};
          }
        `
      : ''}

  ${({ theme, $archived }) =>
    $archived
      ? css`
          color: ${theme.colors.palette.red};
        `
      : ''}
`
