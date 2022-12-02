import create from 'zustand'

import { shortcutStoreConstructor,ShortcutStoreType } from '@mexit/core'

export const useShortcutStore = create<ShortcutStoreType>(shortcutStoreConstructor)
