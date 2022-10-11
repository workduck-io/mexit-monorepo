import { generateTheme } from '../Utils/themeGenerator'

export const vvkTheme = generateTheme({
  type: 'dark',
  // Colors
  primary: '#C792EA',
  secondary: '#8d39c1',

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
  hasBlocks: true,
  backgroundImages: {
    app: 'https://wallpapercave.com/wp/wp2757874.gif',
    preview: 'https://wallpapercave.com/wp/wp2757874.gif'
  },
  custom: 'SpaceAmethyst'
})
