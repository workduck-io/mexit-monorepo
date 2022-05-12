import { defaultThemes, devTheme, lightTheme } from '../Themes'
import { DefaultTheme } from 'styled-components'

export interface Theme {
  id: string
  themeData: DefaultTheme
}

export interface ThemeStoreState {
  theme: Theme
  themes: Theme[]
  setTheme: (theme: Theme) => void
  setThemes: (theme: Theme[]) => void
}

export const themeStoreConstructor = (set) => ({
  theme: { id: 'Dev', themeData: devTheme },

  themes: defaultThemes,

  setTheme: (theme: Theme) => {
    set({ theme })
  },

  setThemes: (themes: Theme[]) => {
    set({ themes })
  }
})
