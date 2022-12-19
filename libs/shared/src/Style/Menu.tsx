import { Menu } from 'react-contexify'

import styled from 'styled-components'

import { generateStyle } from '@workduck-io/mex-themes'

export const StyledContexifyMenu = styled(Menu)`
  &.react-contexify {
    background-color: ${({ theme }) => theme.generic.contextMenu.menu.surface};
    box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
  }

  .react-contexify__submenu--is-open,
  .react-contexify__submenu--is-open > .react-contexify__item__content {
  }

  .react-contexify__submenu--is-open > .react-contexify__submenu {
  }

  .react-contexify .react-contexify__submenu {
  }

  .react-contexify__submenu-arrow {
  }

  .react-contexify__separator {
    background-color: ${({ theme }) => theme.tokens.surfaces.separator};
  }

  .react-contexify__will-leave--disabled {
  }

  .react-contexify__item {
    svg {
      margin-right: ${({ theme }) => theme.spacing.small};
    }
  }

  .react-contexify__item:not(.react-contexify__item--disabled):focus {
    ${({ theme }) => generateStyle(theme.generic.contextMenu.item.hover)}
  }

  .react-contexify__item:not(.react-contexify__item--disabled):hover > .react-contexify__item__content,
  .react-contexify__item:not(.react-contexify__item--disabled):focus > .react-contexify__item__content {
    ${({ theme }) => generateStyle(theme.generic.contextMenu.item.hover)}
  }

  .react-contexify__item:not(.react-contexify__item--disabled):hover > .react-contexify__submenu {
  }

  .react-contexify__item--disabled {
  }

  .react-contexify__item__content {
    color: ${({ theme }) => theme.tokens.text.default};
  }
`
