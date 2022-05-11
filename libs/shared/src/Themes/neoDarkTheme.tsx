import generateTheme from '../Utils/themeGenerator'

export const neoDark = generateTheme({
  // border-radius: 43px;
  // background: #c4cce0;
  // box-shadow:  13px 13px 26px #acb4c5,
  //              -13px -13px 26px #dce4fb;
  // Colors
  primary: '#4293F2',
  secondary: '#c31575',

  // Palettes
  gray: {
    1: '#C4CAF8', // Lightest for Light theme
    2: '#A7AEEA',
    3: '#868DC5',
    4: '#6E75AC',
    5: '#555C90',
    6: '#4A4F7C',
    7: '#3D426C',
    8: '#2E335B',
    9: '#212647',
    10: '#13162E' // Darkest for light theme
  },

  palette: {
    white: '#ffffff',
    black: '#000000',
    green: '#00e676',
    yellow: '#eeff41',
    red: '#fb4934'
  },
  text: {
    heading: '#CDD6EC',
    default: '#909EC4',
    subheading: '#909EC4',
    fade: '#7580A6',
    disabled: '#9CA2BA',
    accent: '#CC7796',
    oppositePrimary: '#ffffff'
  },
  hasBlocks: true
})
