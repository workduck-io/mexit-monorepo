import generateTheme from '../Utils/themeGenerator'

export const xemTheme = generateTheme({
  // Colors
  primary: '#2D9EDF',
  secondary: '#128C7E',

  // Palettes
  gray: {
    10: '#181b20', // Darkest
    9: '#292d30',
    8: '#2f353a',
    7: '#40444B',
    6: '#4E525A',
    5: '#646A75',
    4: '#8E9096',
    3: '#A3AEBD',
    2: '#D1D3DA',
    1: '#FFFFFF' // Lightest
  },
  palette: {
    white: '#ffffff',
    black: '#000000',
    green: '#00e676',
    yellow: '#eeff41',
    red: '#fb4934'
  },
  text: {
    heading: '#E4F1FF',
    default: '#cbd2d8',
    subheading: '#D1E5FB',
    fade: '#a1a4a9',
    disabled: '#72767D',
    accent: '#fe8019',
    oppositePrimary: '#ffffff'
  },
  custom: 'MexStyles'
})
