import generateTheme from '../Utils/themeGenerator'

export const imperialTheme = generateTheme({
  // Colors
  primary: '#c31575',
  secondary: '#748EFF',

  // Palettes
  gray: {
    10: '#0f111a', // Darkest
    9: '#212537',
    8: '#323954',
    7: '#5e6480',
    6: '#8289a8',
    5: '#858db5',
    4: '#9ca3c4',
    3: '#b3b7d3',
    2: '#dcdfef',
    1: '#e9ebf8' // Lightest
  },

  palette: {
    white: '#ffffff',
    black: '#000000',
    green: '#00e676',
    yellow: '#eeff41',
    red: '#fb4934'
  },
  text: {
    heading: '#ffffff',
    default: '#b0b8db',
    subheading: '#D0D4E7',
    fade: '#b3b7d3',
    disabled: '#9CA2BA',
    accent: '#BCC7FF',
    oppositePrimary: '#ffffff'
  },
  backgroundImages: {
    app: 'https://i.imgur.com/Z2iNoSC.jpg'
  }
})
