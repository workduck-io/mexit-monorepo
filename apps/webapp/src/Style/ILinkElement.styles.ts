import { transparentize } from 'polished'
import styled, { css } from 'styled-components'

export const SILinkRoot = styled.div`
  display: inline-block;
  line-height: 1.2;

  /* outline: selectedFocused ? rgb(0, 120, 212) auto 1px : undefined, */
`

interface SILinkProps {
  selected: boolean
  archived?: boolean
}

export const SILink = styled.div<SILinkProps>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  /* color: ${({ theme, archived }) => (archived ? theme.colors.fade : theme.colors.secondary)}; */
  cursor: pointer;
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

  ${({ theme, selected }) =>
    selected
      ? css`
          color: ${theme.colors.primary};
          background-color: ${transparentize(0.75, theme.colors.primary)};
          border-radius: ${theme.borderRadius.tiny};
          .ILink_decoration {
            color: ${theme.colors.gray[4]};
          }
        `
      : ''}
`
