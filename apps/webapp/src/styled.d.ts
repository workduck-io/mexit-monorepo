import { ThemeType } from '@mexit/shared'
import { CSSProp } from 'styled-components'

declare module 'react' {
  interface Attributes {
    css?: CSSProp
  }
}

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends ThemeType {}
}
