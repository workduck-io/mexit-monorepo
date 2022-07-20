import fileDocument from '@iconify/icons-gg/file-document'
import appsLine from '@iconify/icons-ri/apps-line'
import checkboxLine from '@iconify/icons-ri/checkbox-line'
import quillPenLine from '@iconify/icons-ri/quill-pen-line'
import searchLine from '@iconify/icons-ri/search-line'
import timerFlashLine from '@iconify/icons-ri/timer-flash-line'
import { Icon } from '@iconify/react'
import React, { useMemo } from 'react'
import { useMatch } from 'react-router-dom'

import { getNodeidFromPathAndLinks, useLinks } from '../Hooks/useLinks'
import { ROUTE_PATHS } from '../Hooks/useRouting'
import { useDataStore } from '../Stores/useDataStore'
import { useEditorStore } from '../Stores/useEditorStore'
import { useHelpStore } from '../Stores/useHelpStore'
import { useReminderStore } from '../Stores/useReminderStore'
import { useSnippetStore } from '../Stores/useSnippetStore'
import { useTodoStore } from '../Stores/useTodoStore'
import { NavLinkData } from '../Types/Nav'

/*
Sidebar links are defined here
*/

// Disabled as IconifyIcon type doesn't work
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const GetIcon = (icon: any): React.ReactNode => <Icon icon={icon} />

const useNavlinks = () => {
  const shortcuts = useHelpStore((store) => store.shortcuts)

  const match = useMatch(`${ROUTE_PATHS.node}/:nodeid`)
  const nodeid = match?.params?.nodeid || useEditorStore.getState().node.nodeid

  // const count = useMemo(() => getLinkCount(), [reminders, ilinks, archive, tasks])

  const getLinks = () => {
    const links: NavLinkData[] = [
      {
        title: 'Notes',
        path: `${ROUTE_PATHS.node}/${nodeid}`,
        shortcut: shortcuts.showEditor.keystrokes,
        icon: GetIcon(fileDocument)
        // count: count.notes
      },

      {
        title: 'Snippets',
        path: ROUTE_PATHS.snippets,
        shortcut: shortcuts.showSnippets.keystrokes,
        icon: GetIcon(quillPenLine)
        // count: count.snippets
      },
      {
        title: 'Tasks',
        path: ROUTE_PATHS.tasks,
        icon: GetIcon(checkboxLine),
        shortcut: shortcuts.showTasks.keystrokes
        // count: count.tasks
        // isComingSoon: true
      },
      {
        title: 'Reminders',
        path: ROUTE_PATHS.reminders,
        icon: GetIcon(timerFlashLine),
        // count: count.reminders
        shortcut: shortcuts.showReminder.keystrokes
        // isComingSoon: true
      },

      {
        title: 'Integrations',
        path: ROUTE_PATHS.integrations,
        shortcut: shortcuts.showIntegrations.keystrokes,
        icon: GetIcon(appsLine)
      }
    ]
    return links
  }

  return { getLinks }
}

export default useNavlinks
