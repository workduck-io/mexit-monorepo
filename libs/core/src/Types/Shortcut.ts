export type Key = {
  name: string
  code: string
  alias?: string
  isModifier: boolean
  modifiers: Array<Key>
}

export type ShortcutListner = {
  shortcut: KeyBinding
}

export type KeyBindingPress = [string[], string]

export type KeyBinding = {
  key: string
  alias: string
}
