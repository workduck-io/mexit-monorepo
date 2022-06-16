import { themeStoreConstructor, ThemeStoreState } from '@mexit/shared'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'

const useThemeStore = create<ThemeStoreState>(
  persist(themeStoreConstructor, { name: 'mexit-theme-store', getStorage: () => asyncLocalStorage })
)

export default useThemeStore
