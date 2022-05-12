import generateTheme from '../Utils/themeGenerator'

export const vertigoTheme = generateTheme({
  // Colors
  primary: '#E56895',
  secondary: '#B877EC',

  // Palettes
  gray: {
    1: '#CABADE', // Lightest for Light theme
    2: '#A790C4',
    3: '#8475A6',
    4: '#6A6392',
    5: '#544D7D',
    6: '#4D436B',
    7: '#403758',
    8: '#322B45',
    9: '#29263E',
    10: '#171A27' // Darkest for light theme
  },

  palette: {
    white: '#ffffff',
    black: '#000000',
    green: '#00e676',
    yellow: '#eeff41',
    red: '#fb4934'
  },
  text: {
    heading: '#A790C4',
    default: '#B0A1D1',
    subheading: '#C490C0',
    fade: '#9891C2',
    disabled: '#9CA2BA',
    accent: '#CC7796',
    oppositePrimary: '#ffffff'
  },
  hasBlocks: true,
  backgroundImages: {
    app: 'https://i.imgur.com/5og7Xot.png',
    preview: 'https://i.imgur.com/8tfThnE.png'
  }
})
