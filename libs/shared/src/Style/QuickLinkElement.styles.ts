import { Icon } from '@iconify/react'
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
    color: rgba(${({ theme }) => theme.rgbTokens.colors.primary.default}, 0.7);
  }
  .ILink_decoration {
    color: ${({ theme }) => theme.tokens.colors.secondary};
    &_left {
    }
    &_right {
      margin-left: ${({ theme }) => theme.spacing.tiny};
    }
    &_value {
      color: ${({ theme }) => theme.tokens.colors.primary.default};
    }
  }

  ${({ theme, $selected }) =>
    $selected
      ? css`
          color: ${theme.tokens.colors.primary.default};
          background-color: ${theme.tokens.surfaces.s[2]};
          border-radius: ${({ theme }) => theme.borderRadius.tiny};
          .ILink_decoration {
            color: ${({ theme }) => theme.tokens.colors.primary.default};
          }
        `
      : ''}

  ${({ theme, $archived }) =>
    $archived
      ? css`
          color: ${theme.tokens.colors.red};
        `
      : ''}
`

export const TaskSLink = styled(SILink)`
  svg {
    color: ${({ theme }) => theme.tokens.colors.secondary};
  }
  .ILink_decoration {
    &_value {
      ${({ theme, $archived }) =>
        $archived
          ? css`
              color: ${theme.tokens.colors.red};
            `
          : css`
              background: -webkit-linear-gradient(
                60deg,
                ${theme.colors.secondary},
                ${theme.tokens.colors.primary.default}
              );
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            `}
    }
  }
`
