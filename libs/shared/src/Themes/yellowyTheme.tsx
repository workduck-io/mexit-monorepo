import generateTheme from '../Utils/themeGenerator'

export const yellowyTheme = generateTheme({
  // Colors
  primary: '#febb07',
  secondary: '#E84131',

  // Palettes
  gray: {
    10: '#fff8e6', // Surface
    9: '#fff1cd',
    8: '#ffe8a8',
    7: '#fecf51',
    6: '#fec220',
    5: '#e2ac18',
    4: '#cf9d14',
    3: '#a77f14',
    2: '#695211',
    1: '#161c24' // Text
  },
  palette: {
    white: '#ffffff',
    black: '#000000',
    green: '#00e676',
    yellow: '#eeff41',
    red: '#ff3b30'
  },
  // text: {
  //   heading: '#CBCDD2',
  //   default: '#A6ACCD',
  //   subheading: '#abafc7',
  //   fade: '#9196B3',
  //   disabled: '#7f8288',
  //   accent: '#C792EA',
  //   oppositePrimary: '#000',
  // },
  backgroundImages: {
    app: 'https://i.imgur.com/0SGx9h8.png',
    preview: 'https://i.imgur.com/Lwos7os.png'
  }
})
