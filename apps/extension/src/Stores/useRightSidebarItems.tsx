import React from 'react'

import quillPenLine from '@iconify/icons-ri/quill-pen-line'
import { getNextWrappingIndex } from '@udecode/plate'

import { Group, MexIcon, TabHeading, TabType } from '@mexit/shared'

import { ContextInfoBar } from '../Components/Sidebar/ContextInfoBar'
import { NotesInfoBar } from '../Components/Sidebar/NotesInfoBar'
import { SnippetsInfoBar } from '../Components/Sidebar/SnippetsInfoBar'

import { useLayoutStore } from './useLayoutStore'

export const useRightSidebarItems = () => {
  // Ensure the tabs have InfobarType in type
  const getRHSTabs = (): Array<TabType> => [
    {
      label: (
        <Group>
          <MexIcon $noHover icon="mdi:web-plus" width={24} height={24} />
          <TabHeading>Context</TabHeading>
        </Group>
      ),
      type: 'context',
      component: <ContextInfoBar />
    },
    {
      label: (
        <Group>
          <MexIcon $noHover icon={quillPenLine} width={24} height={24} />
          <TabHeading>Snippets</TabHeading>
        </Group>
      ),
      type: 'snippets',
      component: <SnippetsInfoBar />
    },
    {
      label: (
        <Group>
          <MexIcon $noHover icon="gg:file-document" width={24} height={24} />
          <TabHeading>Notes</TabHeading>
        </Group>
      ),
      type: 'notes',
      component: <NotesInfoBar />
    }
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
