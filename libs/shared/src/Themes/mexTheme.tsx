import { generateTheme } from '../Utils/themeGenerator'

export const mexTheme = generateTheme({
  type: 'dark',
  // Colors
  primary: '#55A2EA',
  secondary: '#B877EC',

  // Palettes
  gray: {
    10: '#191B2B', // Darkest
    9: '#26283e',
    8: '#2b2e4a',
    7: '#363959',
    6: '#525579',
    5: '#878BAE',
    4: '#8F94C1',
    3: '#9BA5D8',
    2: '#B9C1D6',
    1: '#ffffff' // Lightest
  },
  palette: {
    white: '#ffffff',
    black: '#000000',
    green: '#00e676',
    yellow: '#eeff41',
    red: '#fb4934'
  },
  text: {
    heading: '#E4F1FF',
    default: '#B9C1D6',
    subheading: '#D1E5FB',
    fade: '#9aa2c9',
    disabled: '#72767D',
    accent: '#fe8019',
    oppositePrimary: '#1F2933'
  },
  custom: 'xemThemeStyles'
})
