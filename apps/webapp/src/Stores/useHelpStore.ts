import create from 'zustand'

import { defaultShortcuts } from '../Data/defaultShortcuts'
import produce from 'immer'
import { persist } from 'zustand/middleware'
import { IDBStorage } from '@mexit/core'

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
      shortcuts: defaultShortcuts
    }),
    {
      name: 'mexit-help-store',
      getStorage: () => IDBStorage
    }
  )
)
