import { themeStoreConstructor, ThemeStoreState } from '@mexit/shared'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { storageAdapter } from '@mexit/core'

const useThemeStore = create<ThemeStoreState>(
  persist(themeStoreConstructor, { name: 'mexit-theme-store', ...storageAdapter })
)

export default useThemeStore
