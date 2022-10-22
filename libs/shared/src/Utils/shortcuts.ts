export const getDisplayShortcut = (keybinding: string) => {
  let mod = '⌘'
  const platform = navigator.platform.toLowerCase()
  if (platform.indexOf('mac') >= 0) {
    mod = '⌘'
  } else {
    mod = 'Ctrl'
  }
  return (
    keybinding
      .replaceAll('$mod', mod)
      .replaceAll('Key', '')
      .replaceAll('Shift', '⇧')
      .replaceAll('Slash', '/')
      .replaceAll('?', '/')
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
