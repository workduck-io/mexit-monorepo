import { generateTheme } from '../Utils/themeGenerator'

export const lightTheme = generateTheme({
  type: 'light',
  // Colors
  primary: '#34be79',
  secondary: '#2b76cc',

  // Palettes
  gray: {
    10: '#ffffff', // Darkest
    9: '#e5f3ed',
    8: '#dfeeeb',
    7: '#d9e6e3',
    6: '#c0c7c5',
    5: '#8baca5',
    4: '#64867f',
    3: '#45665f',
    2: '#2a413c',
    1: '#162421' // Lightest
  },
  palette: {
    white: '#ffffff',
    black: '#000000',
    green: '#00e676',
    yellow: '#eeff41',
    red: '#ff3b30'
  }
  // text: {
  //   heading: '#CBCDD2',
  //   default: '#A6ACCD',
  //   subheading: '#abafc7',
  //   fade: '#9196B3',
  //   disabled: '#7f8288',
  //   accent: '#C792EA',
  // },
})
