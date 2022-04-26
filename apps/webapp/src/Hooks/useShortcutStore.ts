import { EXCLUDED_KEYS_MODIFIERS, KEY_MODIFIERS, getKeyFromKeycode } from '@mexit/core'
import create from 'zustand'
import { Key } from './useShortcutListener'

export type KeyBinding = {
  key: string
  alias: string
}

export type ShortcutStoreType = {
  modifiers: Set<string>
  excludedKeys: Set<string>

  // editMode: boolean
  // setEditMode: (editMode: boolean) => void

  resetIndex: number

  currentShortcut?: any
  setCurrentShortcut: (shortcut: any) => void

  keybinding: KeyBinding
  setKeyBinding: (keybinding: KeyBinding) => void

  withModifier: boolean
  setWithModifier: (withModifier: boolean) => void

  keystrokes: Array<Array<Key>>
  addInKeystrokes: (key: Key) => void

  resetStore: () => void
}

export const useShortcutStore = create<ShortcutStoreType>((set, get) => ({
  excludedKeys: new Set(EXCLUDED_KEYS_MODIFIERS),
  modifiers: new Set(KEY_MODIFIERS),

  keybinding: {
    key: '',
    alias: ''
  },
  setKeyBinding: (keybinding) => set({ keybinding }),

  // editMode: false,
  // setEditMode: (editMode: boolean) => {
  //   ipcRenderer.send(IpcAction.DISABLE_GLOBAL_SHORTCUT, { disable: editMode })
  //   set({ editMode })
  // },

  resetIndex: 0,
  setCurrentShortcut: (shortcut) => set({ currentShortcut: shortcut }),

  withModifier: false,
  setWithModifier: (withModifier) => set({ withModifier }),

  keystrokes: [[], []],

  addInKeystrokes: (key) => {
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
      keystrokes: [[], []]
      // editMode: false
    })
  }
}))
