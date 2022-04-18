export const getDisplayShortcut = (keybinding: string) => {
  let mod = '⌘'
  if (process.platform === 'darwin') {
    mod = '⌘'
  } else if (process.platform === 'win32') {
    mod = 'Ctrl'
  }
  return (
    keybinding
      .replaceAll('$mod', mod)
      .replaceAll('Key', '')
      .replaceAll('Shift', '⇧')
      .replaceAll('Enter', '⏎')
      .replaceAll(' ', ' ... ')
      // .replaceAll('ArrowUp', '⏎')
      // .replaceAll('ArrowDown', '⏎')
      // .replaceAll('ArrowLeft', '˂')
      // .replaceAll('ArrowRight', '⏎')
      .replaceAll('Backslash', '\\')
  )
}

export const getSplitDisplayShortcut = (keybindings: string): string[] => {
  return keybindings.split('+').map(getDisplayShortcut)
}
