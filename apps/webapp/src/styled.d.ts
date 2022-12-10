import { CSSProp } from 'styled-components'

import { MexTheme } from '@workduck-io/mex-themes'

declare module 'react' {
  interface Attributes {
    css?: CSSProp
  }
}

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends MexTheme {}
}
