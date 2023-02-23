import { Key, KeyBinding } from '../Types/Shortcut'
import { StoreIdentifier } from '../Types/Store'
import { EXCLUDED_KEYS_MODIFIERS, getKeyFromKeycode, KEY_MODIFIERS } from '../Utils/keyMap'
import { createStore } from '../Utils/storeCreator'

export const shortcutStoreConfig = (set, get) => ({
  excludedKeys: new Set(EXCLUDED_KEYS_MODIFIERS),
  modifiers: new Set(KEY_MODIFIERS),
  currentShortcut: {} as any,

  keybinding: {
    key: '',
    alias: ''
  },
  setKeyBinding: (keybinding: KeyBinding) => set({ keybinding }),

  editMode: false,
  setEditMode: (editMode: boolean) => {
    // ipcRenderer.send(IpcAction.DISABLE_GLOBAL_SHORTCUT, { disable: editMode })
    set({ editMode })
  },

  resetIndex: 0,
  setCurrentShortcut: (shortcut) => set({ currentShortcut: shortcut }),

  withModifier: false,
  setWithModifier: (withModifier: boolean) => set({ withModifier }),

  keystrokes: [[], []] as Array<Array<Key>>,

  addInKeystrokes: (key: Key) => {
    const modifiers = key.modifiers
    let resetIndex = get().resetIndex

    let keystrokes = get().keystrokes
    const keyInModifers = get().modifiers.has(key.name)

    const lastKeyStroke = keystrokes[resetIndex].slice(-1)[0]
    const isLastKeyNonModifier = lastKeyStroke && !get().modifiers.has(lastKeyStroke.name)

    const notExcludedKey = !get().excludedKeys.has(key.name)

    const keyName = getKeyFromKeycode(key.code)

    const modifiedShortcut: Array<Key> = keyInModifers ? modifiers : [...modifiers, { ...key, name: keyName }]

    if (isLastKeyNonModifier) {
      if (resetIndex === 0) resetIndex = 1
      else {
        resetIndex = 0
        keystrokes = [[], []]
      }
    }

    keystrokes[resetIndex] = modifiedShortcut

    if ((key.isModifier && notExcludedKey) || (resetIndex === 1 && !keyInModifers)) {
      set({
        keystrokes,
        keybinding: {
          key: keystrokes.map((keystroke) => keystroke.map((key) => key.alias).join('+')).join(' '),
          alias: keystrokes.map((keystroke) => keystroke.map((key) => key.name).join('+')).join(' ')
        },
        resetIndex
      })
    }
  },

  resetStore: () => {
    set({
      keybinding: {
        key: '',
        alias: ''
      },
      resetIndex: 0,
      keystrokes: [[], []],
      editMode: false
    })
  }
})

export const useShortcutStore = createStore(shortcutStoreConfig, StoreIdentifier.SHORTCUTS, true)
