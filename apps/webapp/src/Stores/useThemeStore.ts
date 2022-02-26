import { lightTheme, defaultThemes } from '@mexit/shared'
import create from 'zustand'
import { persist } from 'zustand/middleware'

interface Theme {
  id: string
  themeData: any
}

interface ThemeStoreState {
  theme: Theme
  themes: Theme[]
  setTheme: (theme: Theme) => void
  setThemes: (theme: Theme[]) => void
}

const useThemeStore = create<ThemeStoreState>(
  persist(
    (set) => ({
      theme: { id: 'Light', themeData: lightTheme },

      themes: defaultThemes,

      setTheme: (theme: Theme) => {
        set({ theme })
      },

      setThemes: (themes: Theme[]) => {
        set({ themes })
      }
    }),
    { name: 'mexit-theme-store' }
  )
)

export default useThemeStore
