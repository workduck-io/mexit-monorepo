import { devTheme } from './devTheme'
import { gruvboxTheme } from './gruvboxTheme'
import { hackerTheme } from './hackerTheme'
import { imperialTheme } from './imperialTheme'
import { lightTheme } from './lightTheme'
import { matrixTheme } from './matrixTheme'
import { neoLight } from './neoLightTheme'
import { reduxTheme } from './reduxTheme'
import { renarTheme } from './renarTheme'
import { sapphireTheme } from './sapphireTheme'
import { spotlightTheme } from './spotlightTheme'
import { vvkTheme } from './vvkTheme'
import { yellowyTheme } from './yellowyTheme'

export const defaultThemes = [
  { id: 'Gruvbox', themeData: gruvboxTheme },
  { id: 'Gruvbox+', themeData: reduxTheme },
  { id: 'Dev', themeData: devTheme },
  { id: 'Dev+', themeData: matrixTheme },
  { id: 'Amethyst', themeData: vvkTheme },
  { id: 'Light', themeData: lightTheme },
  { id: 'Sapphire', themeData: sapphireTheme },
  { id: 'Clean', themeData: spotlightTheme },
  { id: 'Yellowy', themeData: yellowyTheme },
  { id: 'Neo Light', themeData: neoLight },
  { id: 'Imperial', themeData: imperialTheme },
  { id: 'Renar', themeData: renarTheme },
  { id: 'Hacker', themeData: hackerTheme }
]

export const getTheme = (themeId: string) => {
  const theme = defaultThemes.filter((t) => t.id === themeId)
  if (theme.length > 0) return theme[0]
  return defaultThemes[0]
}
