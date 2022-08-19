import React, { useEffect } from 'react'

import saveLine from '@iconify/icons-ri/save-line'
import { TippyProps } from '@tippyjs/react'
import toast from 'react-hot-toast'

import { tinykeys } from '@workduck-io/tinykeys'

import { getEventNameFromElement, mog } from '@mexit/core'
import { IconButton } from '@mexit/shared'

import useAnalytics from '../Hooks/useAnalytics'
import { ActionType } from '../Hooks/useAnalytics/events'
import { useSnippetBuffer } from '../Hooks/useEditorBuffer'
import { useSaver } from '../Hooks/useSaver'
import { useKeyListener } from '../Hooks/useShortcutListener'
import { useUpdater } from '../Hooks/useUpdater'
import { useEditorStore } from '../Stores/useEditorStore'
import { useHelpStore } from '../Stores/useHelpStore'
import { useSnippetStore } from '../Stores/useSnippetStore'

interface SaverButtonProps {
  title?: string
  shortcut?: string
  noButton?: boolean
  // Warning doesn't get the current node in the editor
  saveOnUnmount?: boolean
  callbackAfterSave?: (nodeId?: string) => void
  callbackBeforeSave?: () => void
  singleton?: TippyProps['singleton']
}

/** A very special saver button
 *
 * It implements the save action and shortcuts in isolation so that the editor does not rerender on every document save.
 */
export const SaverButton = ({
  callbackAfterSave,
  callbackBeforeSave,
  title,
  shortcut,
  saveOnUnmount,
  noButton,
  singleton
}: SaverButtonProps) => {
  const { onSave: onSaveFs } = useSaver()

  const shortcuts = useHelpStore((state) => state.shortcuts)
  const { shortcutDisabled } = useKeyListener()
  const node = useEditorStore((state) => state.node)

  const onSave = () => {
    if (callbackBeforeSave) callbackBeforeSave()
    onSaveFs(node)
    if (callbackAfterSave) callbackAfterSave(node.nodeid)
  }

  useEffect(() => {
    if (saveOnUnmount) {
      return () => {
        onSave()
      }
    }
  }, [])

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.save.keystrokes]: (event) => {
        event.preventDefault()
        if (!shortcutDisabled) onSave()
      }
    })

    return () => {
      unsubscribe()
    }
  })

  if (noButton) return <></>

  return (
    <IconButton
      shortcut={shortcut}
      size={24}
      icon={saveLine}
      singleton={singleton}
      onClick={onSave}
      title={title ?? 'Save'}
    />
  )
}

export const useSnippetSaver = () => {
  // const editorState = usePlateSelectors(usePlateId()).value()
  const { saveAndClearBuffer } = useSnippetBuffer()
  const { updater } = useUpdater()
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)

  const onSave = () => {
    saveAndClearBuffer()
    updater()

    mog('saveSnippet in onSave')
    toast('Snippet Saved!', { duration: 1000 })
  }

  return { onSave }
}

interface SnippetExtras {
  title: string
  template: boolean
}
interface SnippetSaverButtonProps extends SaverButtonProps {
  getSnippetExtras: () => SnippetExtras
}

export const SnippetSaverButton = ({ callbackAfterSave, title, getSnippetExtras }: SnippetSaverButtonProps) => {
  const { onSave: onSaveFs } = useSnippetSaver()
  const shortcuts = useHelpStore((state) => state.shortcuts)
  const { trackEvent } = useAnalytics()

  const onSave = () => {
    const extras = getSnippetExtras()
    trackEvent(getEventNameFromElement('Editor', ActionType.CREATE, 'Snippet'), { 'mex-title': extras.title })

    onSaveFs()

    if (callbackAfterSave) callbackAfterSave()
  }

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.save.keystrokes]: (event) => {
        event.preventDefault()
        onSave()
      }
    })
    return () => {
      unsubscribe()
    }
  })

  return (
    <IconButton
      size={24}
      shortcut={shortcuts.save.keystrokes}
      icon={saveLine}
      onClick={onSave}
      title={title ?? 'Save'}
    />
  )
}
