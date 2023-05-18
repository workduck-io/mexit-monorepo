import merge from 'deepmerge'
import produce from 'immer'

import { Shortcut } from '../Types/Help'
import { StoreIdentifier } from '../Types/Store'
import { defaultShortcuts } from '../Utils/defaultShortcutsData'
import { createStore } from '../Utils/storeCreator'

const helpStoreConfig = (set, get) => ({
  open: false,
  shortcuts: defaultShortcuts,
  toggleModal: () =>
    set({
      open: !get().open
    }),
  closeModal: () =>
    set({
      open: false
    }),
  changeShortcut: (keybinding: Shortcut) => {
    set(
      produce((draft: any) => {
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
  reset: () => set({ shortcuts: defaultShortcuts })
})

export const useHelpStore = createStore(helpStoreConfig, StoreIdentifier.HELP, true, {
  version: 2,
  migrate: (persistedState: any, version: number) => {
    persistedState.shortcuts = merge(persistedState.shortcuts, defaultShortcuts)
    return persistedState
  }
})
