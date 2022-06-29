import ColorScheme from 'color-scheme'
import merge from 'deepmerge'
import { getLuminance, lighten, mix, tint } from 'polished'
import { DefaultTheme } from 'styled-components'
import { LayoutStyle, ThemePalette } from '../Types/Theme'

const LayoutTheme: LayoutStyle = {
  spacing: {
    large: '2rem',
    medium: '1rem',
    small: '0.5rem',
    tiny: '0.25rem'
  },
  borderRadius: {
    large: '1rem',
    small: '0.5rem',
    tiny: '0.25rem'
  },
  width: {
    nav: 48,
    sidebar: 300
  },
  indent: {
    sidebar: 8
  }
}

const generateTheme = (p: ThemePalette): DefaultTheme => {
  const mp = (c: string) => mix(0.033, p.primary, c)
  const cc = new ColorScheme()
  const pP = cc
    .from_hex(p.primary.slice(1))
    .scheme('analogic')
    .distance(0.25)
    .variation('light')
    .add_complement(true)
    .colors()
    .map((s) => `#${s}`)

  // const pP = cc
  //   .from_hex(p.primary.slice(1))
  //   .scheme('analogic')
  //   .distance(0.25)
  //   .variation('light')
  //   .colors()
  //   .map((s) => `#${s}`)

  return merge(
    {
      ...LayoutTheme,
      colors: {
        primary: p.primary,
        secondary: p.secondary,

        //
        palette: {
          white: '#ffffff',
          black: '#000000',
          green: '#00e676',
          yellow: '#eeff41',
          red: '#ff3b30',
          blue: '#00b0ff',

          ...p.palette
        },
        gray: p.gray,

        //
        background: {
          app: p.gray[10],
          card: p.gray[9],
          modal: p.gray[9],
          sidebar: p.gray[10],
          highlight: p.gray[8]
        },
        divider: p.gray[4],
        fade: {
          primary: tint(0.15, p.primary),
          secondary: tint(0.15, p.secondary),
          background: tint(0.15, p.gray[10])
        },
        form: {
          input: {
            bg: mix(0.5, p.gray[8], p.gray[9]),
            fg: mp(p.gray[1]),
            border: mp(p.gray[8])
          },
          button: {
            bg: mp(p.gray[7]),
            fg: mp(p.gray[1]),
            border: mp(p.gray[8]),
            hover: mp(p.primary)
          }
        },
        text: p.text ?? {
          heading: mp(p.gray[1]),
          subheading: mp(p.gray[2]),
          default: mp(p.gray[2]),
          fade: mp(p.gray[4]),
          disabled: mp(p.gray[5]),
          accent: mp(p.gray[3]),
          oppositePrimary: getLuminance(p.gray[5]) >= getLuminance(p.primary) ? p.gray[10] : p.gray[1]
        }
      },

      additional: {
        profilePalette: pP,
        reactSelect: {
          borderRadius: 4,
          colors: {
            primary: p.primary,
            primary75: lighten(0.1, p.primary),
            primary50: lighten(0.2, p.primary),
            primary25: p.primary,
            danger: p.palette.red,
            dangerLight: '#FFBDAD',
            neutral0: p.gray[10],
            neutral5: p.gray[9],
            neutral10: p.gray[8],
            neutral20: p.gray[7],
            neutral30: p.gray[6],
            neutral40: p.gray[5],
            neutral50: mix(0.5, p.gray[5], p.gray[4]),
            neutral60: p.gray[4],
            neutral70: p.gray[3],
            neutral80: p.gray[2],
            neutral90: p.gray[1]
          },
          spacing: {
            baseUnit: 4,
            controlHeight: 38,
            menuGutter: 8
          }
        },
        hasBlocks: p.hasBlocks
      },
      custom: p.custom,
      ...p.additionalTheme
    },
    p
  )
}

export default generateTheme
