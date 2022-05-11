import generateTheme from '../Utils/themeGenerator'

export const mexTheme = generateTheme({
  // Colors
  primary: '#0576B9',
  secondary: '#128C7E',

  // Palettes
  gray: {
    10: '#0F2238', // Darkest
    9: '#172B42',
    8: '#193454',
    7: '#354962',
    6: '#556C88',
    5: '#6A83A0',
    4: '#869EBA',
    3: '#A1B8D3',
    2: '#B4CAE3',
    1: '#C4DBF5' // Lightest
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
    default: '#C4DBF5',
    subheading: '#D1E5FB',
    fade: '#A1B8D3',
    disabled: '#72767D',
    accent: '#fe8019',
    oppositePrimary: '#ffffff'
  }
})
