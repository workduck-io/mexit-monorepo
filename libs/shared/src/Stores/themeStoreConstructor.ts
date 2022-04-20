import { defaultThemes, lightTheme } from '../Themes'
import { Theme } from '@mexit/core'

export const themeStoreConstructor = (set) => ({
  theme: { id: 'Light', themeData: lightTheme },

  themes: defaultThemes,

  setTheme: (theme: Theme) => {
    set({ theme })
  },

  setThemes: (themes: Theme[]) => {
    set({ themes })
  }
})
