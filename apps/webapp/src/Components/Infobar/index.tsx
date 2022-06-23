import React, { useEffect } from 'react'
import tinykeys from 'tinykeys'
import useToggleElements from '../../Hooks/useToggleElements'

import useLayout from '../../Hooks/useLayout'
import { useKeyListener } from '../../Hooks/useShortcutListener'
import { useHelpStore } from '../../Stores/useHelpStore'
import { useLayoutStore } from '../../Stores/useLayoutStore'
import { InfoBarWrapper } from '../../Style/Infobar'
import RemindersInfobar from '../Reminders/Reminders'
import DataInfoBar from './DataInfobar'

const InfoBarItems = () => {
  const infobar = useLayoutStore((s) => s.infobar)

  switch (infobar.mode) {
    // case 'graph':
    // return <Graph graphData={graphData} />
    // case 'flow':
    // return <SyncBlockInfo />
    // case 'suggestions':
    // return <SuggestionInfoBar />
    case 'reminders':
      return <RemindersInfobar />
    case 'default':
      return <DataInfoBar />
    default:
      return <DataInfoBar />
  }
}

const InfoBar = () => {
  const focusMode = useLayoutStore((s) => s.focusMode)
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const { getFocusProps } = useLayout()

  const infobar = useLayoutStore((s) => s.infobar)
  const { toggleReminder } = useToggleElements()
  const { shortcutHandler } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      //   [shortcuts.showGraph.keystrokes]: (event) => {
      //     event.preventDefault()
      //     shortcutHandler(shortcuts.showGraph, () => {
      //       toggleGraph()
      //     })
      //   },
      //   [shortcuts.showSyncBlocks.keystrokes]: (event) => {
      //     event.preventDefault()
      //     shortcutHandler(shortcuts.showSyncBlocks, () => {
      //       toggleSyncBlocks()
      //     })
      //   },
      //   [shortcuts.showSuggestedNodes.keystrokes]: (event) => {
      //     event.preventDefault()
      //     shortcutHandler(shortcuts.showSuggestedNodes, () => {
      //       toggleSuggestedNodes()
      //     })
      //   },
      [shortcuts?.showReminder?.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showReminder, () => {
          toggleReminder()
        })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [shortcuts])

  return (
    <InfoBarWrapper mode={infobar.mode} {...getFocusProps(focusMode)}>
      <InfoBarItems />
    </InfoBarWrapper>
  )
}

export default InfoBar
