import { devTheme } from './devTheme'
import { gruvboxTheme } from './gruvboxTheme'
import { hackerTheme } from './hackerTheme'
import { imperialTheme } from './imperialTheme'
import { lightTheme } from './lightTheme'
import { matrixTheme } from './matrixTheme'
import { mexTheme } from './mexTheme'
import { neoDark } from './neoDarkTheme'
import { neoLight } from './neoLightTheme'
import { reduxTheme } from './reduxTheme'
import { renarTheme } from './renarTheme'
import { spotlightTheme } from './spotlightTheme'
import { vertigoTheme } from './vertigoTheme'
import { vvkTheme } from './vvkTheme'
import { yellowyTheme } from './yellowyTheme'

export const defaultThemes = [
  { id: 'Mex', themeData: mexTheme },
  { id: 'Vertigo', themeData: vertigoTheme },
  { id: 'Gruvbox', themeData: gruvboxTheme },
  // { id: 'Gruvbox+', themeData: reduxTheme },
  { id: 'Dev', themeData: devTheme },
  // { id: 'Dev+', themeData: matrixTheme },
  { id: 'Amethyst', themeData: vvkTheme },
  { id: 'Light', themeData: lightTheme },
  { id: 'Clean', themeData: spotlightTheme },
  { id: 'Yellowy', themeData: yellowyTheme },
  { id: 'Neo Light', themeData: neoLight },
  { id: 'Neo Dark', themeData: neoDark },
  { id: 'Imperial', themeData: imperialTheme },
  // { id: 'Renar', themeData: renarTheme },
  { id: 'Hacker', themeData: hackerTheme }
]

export const getTheme = (themeId: string) => {
  const theme = defaultThemes.filter((t) => t.id === themeId)
  if (theme.length > 0) return theme[0]
  return defaultThemes[0]
}
