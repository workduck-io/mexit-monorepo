import { themeStoreConstructor } from '@mexit/shared'
import { ThemeStoreState } from '@mexit/core'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { share, isSupported } from 'shared-zustand'

const useThemeStore = create<ThemeStoreState>(persist(themeStoreConstructor, { name: 'mexit-theme-store' }))

// progressive enhancement check.
if ('BroadcastChannel' in globalThis /* || isSupported() */) {
  // share the property "count" of the state with other tabs
  share('theme', useThemeStore)
}

export default useThemeStore
