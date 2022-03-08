import { themeStoreConstructor, ThemeStoreState } from '@mexit/shared'
import create from 'zustand'
import { persist } from 'zustand/middleware'

const useThemeStore = create<ThemeStoreState>(persist(themeStoreConstructor, { name: 'mexit-theme-store' }))

export default useThemeStore
