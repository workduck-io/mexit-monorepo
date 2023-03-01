import produce from 'immer'

import { StoreIdentifier } from '../Types/Store'
import { defaultShortcuts } from '../Utils/defaultShortcutsData'
import { createStore } from '../Utils/storeCreator'

export const helpStoreConfig = (set, get) => ({
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
        // eslint-disable-next-line
        // @ts-ignore
        Object.keys(draft.shortcuts).map((k) => {
          // eslint-disable-next-line
          // @ts-ignore
          if (draft.shortcuts[k].keystrokes === keybinding.keystrokes) {
            // eslint-disable-next-line
            // @ts-ignore
            draft.shortcuts[k].keystrokes = ''
          }
          // eslint-disable-next-line
          // @ts-ignore
          if (draft.shortcuts[k].title === keybinding.title) {
            // eslint-disable-next-line
            // @ts-ignore
            draft.shortcuts[k].keystrokes = keybinding.keystrokes
          }
          return k
        })
      })
    )
  },
  shortcuts: defaultShortcuts,
  reset: () => set({ shortcuts: defaultShortcuts })
})

export const useHelpStore = createStore(helpStoreConfig, StoreIdentifier.HELP, true);