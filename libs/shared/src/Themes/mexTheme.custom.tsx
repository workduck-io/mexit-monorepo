import { MainNav, SideNav } from '../Style/Nav'
import { css } from 'styled-components'

export const MexThemeStyles = css`
  body {
    background: linear-gradient(-60deg, #17111f, #182033);
  }
  ${MainNav} {
    background: linear-gradient(2.9deg, rgba(38, 46, 66, 0.5) 3.74%, rgba(47, 53, 84, 0.5) 96.25%);
  }

  ${SideNav} {
  }
`
