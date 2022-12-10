// import original module declarations
import 'styled-components'

// import { ThemeType } from './Types/Theme'
import { MexTheme } from '@workduck-io/mex-themes'

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends MexTheme {}
}
