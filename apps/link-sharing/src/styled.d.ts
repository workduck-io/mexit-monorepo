import { ThemeType } from '@mexit/shared'

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
