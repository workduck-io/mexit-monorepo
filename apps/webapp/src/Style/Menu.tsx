import { transparentize } from 'polished'
import { Menu } from 'react-contexify'
import styled from 'styled-components'

export const StyledMenu = styled(Menu)`
  &.react-contexify {
    background-color: ${({ theme }) => theme.colors.background.card};
    box-shadow: 0px 5px 20px ${({ theme }) => transparentize(0.5, theme.colors.palette.black)};
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
    background-color: ${({ theme }) => theme.colors.gray[7]};
  }

  .react-contexify__will-leave--disabled {
  }

  .react-contexify__item {
    svg {
      margin-right: ${({ theme }) => theme.spacing.small};
    }
  }

  .react-contexify__item:not(.react-contexify__item--disabled):focus {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.oppositePrimary};
  }

  .react-contexify__item:not(.react-contexify__item--disabled):hover > .react-contexify__item__content,
  .react-contexify__item:not(.react-contexify__item--disabled):focus > .react-contexify__item__content {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.oppositePrimary};
  }

  .react-contexify__item:not(.react-contexify__item--disabled):hover > .react-contexify__submenu {
  }

  .react-contexify__item--disabled {
  }

  .react-contexify__item__content {
    color: ${({ theme }) => theme.colors.text.default};
  }
`
