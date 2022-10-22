import React, { useEffect } from 'react'

import { tinykeys } from '@workduck-io/tinykeys'

import { InfoBarWrapper } from '@mexit/shared'

import { useKeyListener } from '../../Hooks/useChangeShortcutListener'
import useLayout from '../../Hooks/useLayout'
import useToggleElements from '../../Hooks/useToggleElements'
import { useHelpStore } from '../../Stores/useHelpStore'
import { useLayoutStore } from '../../Stores/useLayoutStore'
import DataInfoBar from './DataInfobar'

const InfoBarItems = () => {
  // const infobar = useLayoutStore((s) => s.infobar)
  // const shortcuts = useHelpStore((store) => store.shortcuts)
  // const setInfobarMode = useLayoutStore((s) => s.setInfobarMode)
  // const isPublicView = useMatch(`${ROUTE_PATHS.share}/:nodeid`)

  //   // Ensure the tabs have InfobarType in type
  //   const tabs: Array<TabType> = useMemo(
  //     () => [
  //       {
  //         label: <MexIcon $noHover icon="fluent:content-view-gallery-24-regular" width={24} height={24} />,
  //         type: 'default',
  //         component: <DataInfoBar />,
  //         tooltip: 'Context'
  //       },
  //       {
  //         label: <MexIcon $noHover icon={timerFlashLine} width={24} height={24} />,
  //         type: 'reminders',
  //         component: <RemindersInfobar />,
  //         tooltip: 'Reminders'
  //       }
  //     ],
  //     []
  //   )

  return <DataInfoBar />
  // <Tabs
  //   visible={true}
  //   openedTab={infobar.mode}
  //   onChange={(tab) => {
  //     setInfobarMode(tab as InfobarMode)
  //   }}
  //   tabs={tabs}
  // />
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
      [shortcuts.showReminder.keystrokes]: (event) => {
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
