import { ThemeType } from '@mexit/shared'

declare module 'styled-components' {
  interface DefaultTheme extends ThemeType {}
}
