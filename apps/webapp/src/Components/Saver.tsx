import saveLine from '@iconify/icons-ri/save-line'
import { getEventNameFromElement } from '@mexit/core'
import { IconButton } from '@mexit/shared'
import { TippyProps } from '@tippyjs/react'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import tinykeys from 'tinykeys'
import useAnalytics from '../Hooks/useAnalytics'
import { ActionType } from '../Hooks/useAnalytics/events'
import { useSnippetBuffer } from '../Hooks/useEditorBuffer'
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

export const useSnippetSaver = () => {
  // const editorState = usePlateSelectors(usePlateId()).value()
  const { saveAndClearBuffer } = useSnippetBuffer()
  // const { updater } = useUpdater()
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)

  const onSave = () => {
    saveAndClearBuffer()
    // updater()

    toast('Snippet Saved!', { duration: 1000 })
  }

  return { onSave }
}

interface SnippetExtras {
  title: string
  isTemplate: boolean
}
interface SnippetSaverButtonProps extends SaverButtonProps {
  getSnippetExtras: () => SnippetExtras
}

export const SnippetSaverButton = ({
  callbackAfterSave,
  title,
  getSnippetExtras,
  noButton
}: SnippetSaverButtonProps) => {
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

  if (noButton) return <></>

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
