import { MiscKeys, ShortcutListner, Key } from '@mexit/core'
import { getEventNameFromElement } from '@mexit/core'
import { mog } from '@workduck-io/mex-editor'
import { useEffect, useCallback, useMemo } from 'react'
import { Shortcut, useHelpStore } from '../Stores/useHelpStore'
import useAnalytics from './useAnalytics'
import { ActionType } from './useAnalytics/events'
import { useShortcutStore } from './useShortcutStore'

export const usePlatformInfo = () =>
  useMemo(
    () => (typeof navigator === 'object' && /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? 'Meta' : 'Control'),
    []
  )

export const getKey = (name: string, alias?: string): Key => {
  return {
    name,
    code: name,
    alias: alias ?? name,
    isModifier: true,
    modifiers: []
  }
}

const useShortcutListener = (): ShortcutListner => {
  const shortcut = useShortcutStore((state) => state.keybinding)
  // const setEditMode = useShortcutStore((state) => state.setEditMode)
  const setWithModifier = useShortcutStore((state) => state.setWithModifier)
  const addInKeystrokes = useShortcutStore((state) => state.addInKeystrokes)
  const changeShortcut = useHelpStore((state) => state.changeShortcut)
  const currentShortcut = useShortcutStore((state) => state.currentShortcut)

  const { trackEvent } = useAnalytics()

  const MOD = usePlatformInfo()

  const getKeyModifiers = (event: KeyboardEvent): Array<Key> => {
    const modifiers = []
    if (event.metaKey) modifiers.push(getKey(MOD, '$mod'))
    if (event.ctrlKey) modifiers.push(getKey('Control'))
    if (event.shiftKey) modifiers.push(getKey('Shift'))
    if (event.altKey) modifiers.push(getKey('Alt'))

    return modifiers
  }

  const pressedWithModifier = (event: KeyboardEvent) => {
    return event.altKey || event.ctrlKey || event.metaKey || event.shiftKey
  }

  const onKeyUp = useCallback((event: KeyboardEvent) => {
    const withModifier = pressedWithModifier(event)

    if (!withModifier) setWithModifier(false)
  }, [])

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        if (shortcut.key.length > 0) {
          changeShortcut({
            ...currentShortcut,
            keystrokes: shortcut.key.trim()
          })
          trackEvent(getEventNameFromElement('Shortcut Settings', ActionType.CHANGE, 'Shortcut'), {
            from: currentShortcut.keystrokes,
            to: shortcut.key.trim()
          })
          // setEditMode(false)
        }
        return
      }

      const key: Key = {
        name: MiscKeys[event.code] ?? event.key,
        code: event.code,
        alias: MiscKeys[event.code] ?? event.code,
        isModifier: pressedWithModifier(event),
        modifiers: getKeyModifiers(event)
      }

      addInKeystrokes(key)
    },
    [currentShortcut, shortcut]
  )

  useEffect(() => {
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [onKeyDown, onKeyUp])

  return { shortcut }
}

export const useKeyListener = () => {
  const shortcutDisabled = useShortcutStore((state) => state.editMode)
  const { trackEvent } = useAnalytics()

  const shortcutHandler = (shortcut: Shortcut, callback: any) => {
    mog('shortcutHandler', { shortcut })
    if (!shortcutDisabled && !shortcut.disabled) {
      trackEvent(getEventNameFromElement('Shortcut Settings', ActionType.KEY_PRESS, 'Shortcut'), shortcut)
      callback()
    }
  }

  return {
    shortcutDisabled,
    shortcutHandler
  }
}

export default useShortcutListener
