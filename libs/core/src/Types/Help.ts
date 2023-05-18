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

export enum FloatingElementType {
  BALLON_TOOLBAR = 'BALLON_TOOLBAR',
  AI_POPOVER = 'AI_POPOVER'
}
