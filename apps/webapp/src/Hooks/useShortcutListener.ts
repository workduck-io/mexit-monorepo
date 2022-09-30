import { useEffect, useCallback, useMemo } from 'react'

import { MiscKeys, ShortcutListner, Key, mog } from '@mexit/core'
import { getEventNameFromElement } from '@mexit/core'

import {
  MenuItemClassName,
  MenuClassName,
  RootMenuClassName,
  MenuFilterInputClassName
} from '../Components/FloatingElements/Dropdown.classes'
import useMultipleEditors from '../Stores/useEditorsStore'
import { Shortcut, useHelpStore } from '../Stores/useHelpStore'
import { useLayoutStore } from '../Stores/useLayoutStore'
import useModalStore from '../Stores/useModalStore'
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
  const setEditMode = useShortcutStore((state) => state.setEditMode)
  const setWithModifier = useShortcutStore((state) => state.setWithModifier)
  const addInKeystrokes = useShortcutStore((state) => state.addInKeystrokes)
  const changeShortcut = useHelpStore((state) => state.changeShortcut)
  const currentShortcut = useShortcutStore((state) => state.currentShortcut)

  // const { trackEvent } = useAnalytics()

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
          // trackEvent(getEventNameFromElement('Shortcut Settings', ActionType.CHANGE, 'Shortcut'), {
          //   from: currentShortcut.keystrokes,
          //   to: shortcut.key.trim()
          // })
          setEditMode(false)
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

      mog('key', { key })
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
  // const { trackEvent } = useAnalytics()

  const shortcutHandler = (shortcut: Shortcut, callback: any) => {
    const showLoader = useLayoutStore.getState().showLoader
    const isModalOpen = !!useModalStore.getState().open
    if (!shortcutDisabled && !shortcut.disabled && !showLoader && !isModalOpen) {
      // trackEvent(getEventNameFromElement('Shortcut Settings', ActionType.KEY_PRESS, 'Shortcut'), shortcut)
      callback()
    }
  }

  return { shortcutDisabled, shortcutHandler }
}

export default useShortcutListener

const MEX_KEYBOARD_IGNORE_CLASSES = {
  all: ['mex-search-input', 'FilterInput', MenuItemClassName, MenuClassName, RootMenuClassName],
  input: ['mex-search-input', 'FilterInput', MenuFilterInputClassName],
  dropdown: [MenuItemClassName, MenuClassName, RootMenuClassName]
}

type IgnoreClasses = 'all' | 'input' | 'dropdown'
interface LocalSkipOptions {
  ignoreClasses?: IgnoreClasses
  skipLocal?: boolean
}

export const useEnableShortcutHandler = () => {
  const isEditingPreview = useMultipleEditors((store) => store.isEditingAnyPreview)

  const isOnElementClass = (ignoreClasses?: IgnoreClasses) => {
    const allIgnore: IgnoreClasses = ignoreClasses ?? 'all'
    const classesToIgnore = MEX_KEYBOARD_IGNORE_CLASSES[allIgnore]
    const fElement = document.activeElement as HTMLElement
    mog('fElement', {
      hasClass: classesToIgnore.some((c) => fElement.classList.contains(c)),
      cl: fElement.classList,
      tagName: fElement.tagName
    })
    const ignoredInputTags =
      ignoreClasses === 'input' || ignoreClasses === 'all'
        ? fElement.tagName === 'INPUT' || fElement.tagName === 'TEXTAREA'
        : false

    return fElement && ignoredInputTags && classesToIgnore.some((c) => fElement.classList.contains(c))
  }

  const enableShortcutHandler = (callback: () => void, options?: LocalSkipOptions) => {
    const allOp = options ?? {
      ignoreClasses: 'all',
      skipLocal: false
    }
    // mog('enableShortcutHandler', { allOp, isEditingPreview, isOnSearchFilter: isOnElementClass(allOp.ignoreClasses) })
    if (isEditingPreview() || !useMultipleEditors.getState().editors) return

    if (!allOp.skipLocal && isOnElementClass(allOp.ignoreClasses)) return

    callback()
  }

  return { enableShortcutHandler }
}
