import generateTheme from '../Utils/themeGenerator'
export const matrixTheme = generateTheme({
  // Colors
  primary: '#31d181',
  secondary: '#937cfc',

  // Palettes
  gray: {
    10: '#0f111a', // Darkest
    9: '#181c2b',
    8: '#252A41',
    7: '#383f5c',
    6: '#535875',
    5: '#73778C',
    4: '#9EA1B2',
    3: '#B9BBC6',
    2: '#D5D6DD',
    1: '#EAEBED' // Lightest
  },
  palette: {
    white: '#ffffff',
    black: '#000000',
    green: '#00e676',
    yellow: '#eeff41',
    red: '#ff3b30'
  },
  text: {
    heading: '#CBCDD2',
    default: '#A6ACCD',
    subheading: '#abafc7',
    fade: '#9196B3',
    disabled: '#7f8288',
    accent: '#C792EA',
    oppositePrimary: '#000'
  },
  backgroundImages: {
    app: 'https://i.imgur.com/vVzVdsW.jpg'
  }
})
