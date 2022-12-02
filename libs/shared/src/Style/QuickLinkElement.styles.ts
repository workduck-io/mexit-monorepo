import { Icon } from '@iconify/react'
import { mix, transparentize } from 'polished'
import styled, { css } from 'styled-components'

export const SILinkRoot = styled.div`
  display: inline-block;
  line-height: 1.2;
  vertical-align: middle;
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

export const TaskSLink = styled(SILink)`
  svg {
    color: ${({ theme }) => theme.colors.secondary};
  }
  .ILink_decoration {
    &_value {
      ${({ theme, $archived }) =>
        $archived
          ? css`
              color: ${theme.colors.gray[6]};
            `
          : css`
              background: -webkit-linear-gradient(
                60deg,
                ${theme.colors.secondary},
                ${mix(0.25, theme.colors.secondary, theme.colors.primary)}
              );
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            `}
    }
  }
`
