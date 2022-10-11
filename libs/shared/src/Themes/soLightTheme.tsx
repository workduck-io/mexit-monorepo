import { generateTheme } from '../Utils/themeGenerator'

export const soLightTheme = generateTheme({
  type: 'light',
  // Colors
  primary: '#E48B39',
  secondary: '#6C71C4',

  // Palettes
  gray: {
    10: '#FDF6E3', // Darkest
    9: '#EEE8D5',
    8: '#E4DDC4',
    7: '#D0C7A4',
    6: '#93A1A1',
    5: '#839496',
    4: '#657B83',
    3: '#586E75',
    2: '#073642',
    1: '#002B36' // Lightest
  },
  palette: {
    white: '#ffffff',
    black: '#000000',
    green: '#00e676',
    yellow: '#eeff41',
    red: '#ff3b30'
  },
  text: {
    heading: '#073642',
    default: '#586E75',
    subheading: '#2F525B',
    fade: '#657B83',
    disabled: '#7f8288',
    accent: '#268BD2',
    oppositePrimary: '#ffffff'
  }
})
