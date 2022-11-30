import quillPenLine from '@iconify/icons-ri/quill-pen-line'
import { MexIcon,TabType } from '@mexit/shared'
import { getNextWrappingIndex } from '@udecode/plate'
import React from 'react'

import { ContextInfoBar } from '../Components/Sidebar/ContextInfoBar'
import { NotesInfoBar } from '../Components/Sidebar/NotesInfoBar'
import { SnippetsInfoBar } from '../Components/Sidebar/SnippetsInfoBar'
import { useLayoutStore } from './useLayoutStore'

export const useRightSidebarItems = () => {
  // Ensure the tabs have InfobarType in type
  const getRHSTabs = (): Array<TabType> => [
    {
      label: <MexIcon $noHover icon="mdi:web-plus" width={24} height={24} />,
      type: 'context',
      component: <ContextInfoBar />,
      tooltip: 'Context'
    },
    {
      label: <MexIcon $noHover icon={quillPenLine} width={24} height={24} />,
      type: 'snippets',
      component: <SnippetsInfoBar />,
      tooltip: 'Snippets'
    },
    {
      label: <MexIcon $noHover icon="gg:file-document" width={24} height={24} />,
      type: 'notes',
      component: <NotesInfoBar />,
      tooltip: 'Notes'
    }

    // TODO: add this back when we have url based reminders
    // The reminderUI components already moved to @mexit/shared
    // {
    //   label: <MexIcon $noHover icon={timerFlashLine} width={24} height={24} />,
    //   type: 'reminders',
    //   component: <ReminderInfobar />,
    //   tooltip: 'Reminders'
    // }
  ]

  const getNextTab = () => {
    const tabs = getRHSTabs()
    const currentTab = useLayoutStore.getState().infobar.mode

    const tabIndex = tabs.findIndex((tab) => tab.type === currentTab)

    const nextIndex = getNextWrappingIndex(1, tabIndex, tabs.length, () => undefined, true)
    return tabs[nextIndex]
  }

  const getPreviousTab = () => {
    const tabs = getRHSTabs()
    const currentTab = useLayoutStore.getState().infobar.mode

    const tabIndex = tabs.findIndex((tab) => tab.type === currentTab)

    const prevIndex = getNextWrappingIndex(-1, tabIndex, tabs.length, () => undefined, true)
    return tabs[prevIndex]
  }

  return {
    getRHSTabs,
    getNextTab,
    getPreviousTab
  }
}
