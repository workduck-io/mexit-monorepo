import { shortcutStoreConstructor,ShortcutStoreType } from '@mexit/core'
import create from 'zustand'

export const useShortcutStore = create<ShortcutStoreType>(shortcutStoreConstructor)
