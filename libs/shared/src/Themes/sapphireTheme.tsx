import generateTheme from '../Utils/themeGenerator'

export const sapphireTheme = generateTheme({
  // Colors
  primary: '#333333',
  secondary: '#3eac94',

  // Palettes
  gray: {
    10: '#ffffff', // Surface
    9: '#f1f5fc',
    8: '#e7ecf4',
    7: '#d5dae2',
    6: '#c1ccd7',
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
  },
  text: {
    heading: '#13151a',
    default: '#222433',
    subheading: '#1b1d2c',
    fade: '#3f4357',
    disabled: '#7f8288',
    accent: '#3a8371',
    oppositePrimary: '#ffffff'
  },
  backgroundImages: {
    app: 'https://i.imgur.com/AjT0mvs.jpg'
  }
})
