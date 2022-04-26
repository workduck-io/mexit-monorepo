const keyMap = {
  LOOKUP: 'command+l'
}

export const MiscKeys = {
  Comma: ',',
  Period: '.',
  Semicolon: ';',
  Quote: '"',
  BracketLeft: '[',
  BracketRight: ']',
  Backquote: '`',
  Minus: '-',
  Equals: '=',
  Backslash: '\\',
  Slash: '/'
}

export const EXCLUDED_KEYS_MODIFIERS = ['Tab', 'CapsLock', 'Space', 'Enter', 'Escape']

export const KEY_MODIFIERS = ['Control', 'Meta', 'Shift', 'Alt']

export const getKeyFromKeycode = (keyCode: string) =>
  MiscKeys[keyCode] ? MiscKeys[keyCode] : keyCode.replace(/(Digit|Key)/gi, '')

export default keyMap
