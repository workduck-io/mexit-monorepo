import { ThemeStoreState } from '@mexit/core'
import { themeStoreConstructor } from '@mexit/shared'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { storageAdapter } from '../Utils/chromeStorageAdapter'

const useThemeStore = create<ThemeStoreState>(
  persist(themeStoreConstructor, { name: 'mexit-theme-store', ...storageAdapter })
)

export default useThemeStore
