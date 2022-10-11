import { generateTheme } from '../Utils/themeGenerator'

export const gruvboxTheme = generateTheme({
  type: 'dark',
  // Colors
  primary: '#b8bb26',
  secondary: '#fabd2f',

  // Palettes
  gray: {
    10: '#1d2021', // Darkest
    9: '#282828',
    8: '#3c3836',
    7: '#504945',
    6: '#665c54',
    5: '#7c6f64',
    4: '#a89984',
    3: '#bdae93',
    2: '#d5c4a1',
    1: '#fbf1c7' // Lightest
  },
  palette: {
    white: '#ffffff',
    black: '#000000',
    green: '#00e676',
    yellow: '#eeff41',
    red: '#fb4934'
  },
  text: {
    heading: '#f9f5d7',
    default: '#ebdbb2',
    subheading: '#f2e5bc',
    fade: '#d5c4a1',
    disabled: '#a89984',
    accent: '#fe8019',
    oppositePrimary: '#282828'
  }
})
