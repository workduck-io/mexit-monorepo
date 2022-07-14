import { themeStoreConstructor, ThemeStoreState, defaultThemes } from '@mexit/shared'
import create from 'zustand'
import { persist } from 'zustand/middleware'

const useThemeStore = create<ThemeStoreState>(
  persist(themeStoreConstructor, {
    name: 'mexit-theme-store',
    version: 1,
    migrate: (persistedState: ThemeStoreState, version: number) => {
      persistedState.themes = defaultThemes
      return persistedState
    }
  })
)

export default useThemeStore
