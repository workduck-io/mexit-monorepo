import { themeStoreConstructor } from '@mexit/shared'
import { ThemeStoreState } from '@mexit/core'
import create from 'zustand'
import { persist } from 'zustand/middleware'

const useThemeStore = create<ThemeStoreState>(persist(themeStoreConstructor, { name: 'mexit-theme-store' }))

export default useThemeStore
