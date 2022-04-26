// import original module declarations
import 'styled-components'
import { BackgroundImages, ColorPalette, ShadePalette } from '@mexit/shared'

type Pixels = number // Pixels in integer

interface LayoutStyle {
  spacing: {
    large: string
    medium: string
    small: string
    tiny: string
  }
  borderRadius: {
    large: string
    small: string
    tiny: string
  }
  width: {
    nav: Pixels
    sidebar: Pixels
  }
  indent: { sidebar: Pixels }
}

export interface ThemeType extends LayoutStyle {
  colors: {
    primary: string
    secondary: string
    palette: ColorPalette
    gray: ShadePalette

    background: {
      app: string
      card: string
      modal: string
      sidebar: string
      highlight: string
    }
    divider: string
    fade: {
      primary: string
      secondary: string
      background: string
    }
    form: {
      input: {
        bg: string
        fg: string
        border: string
      }
      button: {
        bg: string
        fg: string
        hover: string
        border: string
      }
    }
    text: {
      heading: string
      subheading: string
      default: string
      fade: string
      disabled: string
      accent: string
      oppositePrimary: string
    }
  }
  backgroundImages?: BackgroundImages
  additional: {
    profilePalette: string[]
    reactSelect: any
  }
}

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends ThemeType {}
}
