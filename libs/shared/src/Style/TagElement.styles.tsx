import { transparentize } from 'polished'
import styled, { css } from 'styled-components'

export const STagRoot = styled.div`
  display: inline-block;
  line-height: 1.2;

  /* outline: selectedFocused ? rgb(0, 120, 212) auto 1px : undefined, */
`

export const STag = styled.div<{ selected: boolean }>`
  color: ${({ theme }) => theme.colors.secondary};
  ${({ selected, theme }) =>
    selected &&
    css`
      background-color: ${transparentize(0.75, theme.colors.secondary)};
      border-radius: ${theme.borderRadius.tiny};
    `}
  .ILink_decoration {
    color: ${({ theme }) => theme.colors.text.disabled};
    &_left {
      margin-right: ${({ theme }) => theme.spacing.tiny};
    }
    &_right {
      margin-left: ${({ theme }) => theme.spacing.tiny};
    }
  }
`
