import merge from 'deepmerge'
import produce from 'immer'
import create from 'zustand'
import { persist } from 'zustand/middleware'

import { IDBStorage } from '@mexit/core'

import { defaultShortcuts } from '../Data/defaultShortcuts'

export interface Shortcut {
  title: string
  keystrokes: string
  category: string
  global?: boolean
  disabled?: boolean
}

export interface HelpState {
  open: boolean
  changeShortcut: (keybinding: Shortcut) => void
  shortcuts: Record<keyof typeof defaultShortcuts, Shortcut>
  toggleModal: () => void
  closeModal: () => void
  reset: () => void
}

export const useHelpStore = create<HelpState>(
  persist(
    (set, get) => ({
      open: false,
      toggleModal: () =>
        set((state) => ({
          open: !state.open
        })),
      closeModal: () =>
        set({
          open: false
        }),
      changeShortcut: (keybinding) => {
        set(
          produce((draft) => {
            Object.keys(draft.shortcuts).map((k) => {
              if (draft.shortcuts[k].keystrokes === keybinding.keystrokes) {
                draft.shortcuts[k].keystrokes = ''
              }

              if (draft.shortcuts[k].title === keybinding.title) {
                draft.shortcuts[k].keystrokes = keybinding.keystrokes
              }
              return k
            })
          })
        )
      },
      shortcuts: defaultShortcuts,
      reset: () => set({ shortcuts: defaultShortcuts })
    }),
    {
      name: 'mexit-help-store',
      getStorage: () => IDBStorage,
      version: 2,
      migrate: (persistedState: any, version: number) => {
        persistedState.shortcuts = merge(persistedState.shortcuts, defaultShortcuts)
        return persistedState
      }
    }
  )
)
