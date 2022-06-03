import generateTheme from '../Utils/themeGenerator'

export const neoLight = generateTheme({
  // border-radius: 43px;
  // background: #c4cce0;
  // box-shadow:  13px 13px 26px #acb4c5,
  //              -13px -13px 26px #dce4fb;
  // Colors
  primary: '#4293F2',
  secondary: '#c31575',

  // Palettes
  gray: {
    10: '#E1E7F7', // Lightest for Light theme
    9: '#D9E0F1',
    8: '#B2BCD6',
    7: '#C4CCE0',
    6: '#A0ADCC',
    5: '#8997BA',
    4: '#606E8F',
    3: '#495571',
    2: '#415075',
    1: '#263458' // Darkest for light theme
  },

  palette: {
    white: '#ffffff',
    black: '#000000',
    green: '#00e676',
    yellow: '#eeff41',
    red: '#fb4934'
  },
  text: {
    heading: '#415075',
    default: '#495571',
    subheading: '#415075',
    fade: '#415075',
    disabled: '#9CA2BA',
    accent: '#CC7796',
    oppositePrimary: '#ffffff'
  },
  // backgroundImages: {
  //   app: 'https://i.imgur.com/Z2iNoSC.jpg'
  // },
  hasBlocks: true,
  custom: 'NeoLightStyles'
})
