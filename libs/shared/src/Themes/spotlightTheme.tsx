import { generateTheme } from '../Utils/themeGenerator'

export const spotlightTheme = generateTheme({
  type: 'light',
  // Colors
  primary: '#5b94ff',
  secondary: '#2b76cc',

  // Palettes
  gray: {
    10: '#ffffff', // Surface
    9: '#e5eeff',
    8: '#fff',
    7: '#f4f8ff',
    6: '#a3cdfd',
    5: '#8b9aac',
    4: '#647386',
    3: '#455966',
    2: '#2a3241',
    1: '#161c24' // Text
  },
  palette: {
    white: '#ffffff',
    black: '#000000',
    green: '#00e676',
    yellow: '#eeff41',
    red: '#ff3b30'
  }
})
