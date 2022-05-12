import generateTheme from '../Utils/themeGenerator'

export const hackerTheme = generateTheme({
  // Colors
  primary: '#2bff30',
  secondary: '#2bff30',

  // Palettes
  gray: {
    10: '#000000', // Darkest
    9: '#0f111a',
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
    subheading: '#f8f8f8',
    default: '#f0f0f0',
    fade: '#b3b7d3',
    disabled: '#9CA2BA',
    accent: '#2bff30',
    oppositePrimary: '#000000'
  },
  hasBlocks: true,
  backgroundImages: {
    app: 'https://i.imgur.com/OCW3IAi.png',
    preview: 'https://i.imgur.com/qSimBsf.png'
  }
})
