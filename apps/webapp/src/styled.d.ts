import { ThemeType } from '@mexit/shared'
import { CSSProp } from 'styled-components'

declare module 'react' {
  interface Attributes {
    css?: CSSProp
  }
}

declare module 'styled-components' {
  interface DefaultTheme extends ThemeType {}
}
