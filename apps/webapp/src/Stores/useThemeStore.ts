import create from 'zustand'
import { persist } from 'zustand/middleware'

import { themeStoreConstructor, ThemeStoreState, defaultThemes } from '@mexit/shared'

const useThemeStore = create<ThemeStoreState>(
  persist(themeStoreConstructor, {
    name: 'mexit-theme-store',
    version: 3,
    migrate: (persistedState: ThemeStoreState, version: number) => {
      persistedState.themes = defaultThemes
      return persistedState
    }
  })
)

export default useThemeStore
