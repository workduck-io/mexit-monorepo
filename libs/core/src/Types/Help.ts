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
  shortcuts: Record<any, Shortcut>
  toggleModal: () => void
  closeModal: () => void
}
