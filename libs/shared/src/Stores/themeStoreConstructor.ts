import { DefaultTheme } from 'styled-components'

import { defaultThemes, xemTheme } from '../Themes'

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
  theme: { id: 'Xem', themeData: xemTheme },

  themes: defaultThemes,

  setTheme: (theme: Theme) => {
    set({ theme })
  },

  setThemes: (themes: Theme[]) => {
    set({ themes })
  }
})
