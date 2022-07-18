import React, { useMemo } from 'react'
import { Icon } from '@iconify/react'
import timerFlashLine from '@iconify/icons-ri/timer-flash-line'
import checkboxLine from '@iconify/icons-ri/checkbox-line'
import appsLine from '@iconify/icons-ri/apps-line'
import quillPenLine from '@iconify/icons-ri/quill-pen-line'
import fileDocument from '@iconify/icons-gg/file-document'
import searchLine from '@iconify/icons-ri/search-line'

import { ROUTE_PATHS } from '../Hooks/useRouting'
import { useHelpStore } from '../Stores/useHelpStore'
import { NavLinkData } from '../Types/Nav'
import { getNodeidFromPathAndLinks, useLinks } from '../Hooks/useLinks'
import { useDataStore } from '../Stores/useDataStore'
import { useEditorStore } from '../Stores/useEditorStore'
import { useReminderStore } from '../Stores/useReminderStore'
import { useTodoStore } from '../Stores/useTodoStore'
import { useSnippetStore } from '../Stores/useSnippetStore'

/*
Sidebar links are defined here
*/

// Disabled as IconifyIcon type doesn't work
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const GetIcon = (icon: any): React.ReactNode => <Icon icon={icon} />

const useNavlinks = () => {
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const nodeid = useEditorStore((store) => store.node.nodeid)
  const baseNodeId = useDataStore((store) => store.baseNodeId)
  const snippets = useSnippetStore((store) => store.snippets)

  const reminders = useReminderStore((store) => store.reminders)
  const ilinks = useDataStore((store) => store.ilinks)
  const archive = useDataStore((store) => store.archive)
  const tasks = useTodoStore((store) => store.todos)
  const { getLinkCount } = useLinks()

  const noteId = useMemo(() => {
    const currentNotId = nodeid === '__null__' ? getNodeidFromPathAndLinks(ilinks, baseNodeId) : nodeid
    return currentNotId
  }, [nodeid, ilinks])

  const count = useMemo(() => getLinkCount(), [reminders, ilinks, archive, tasks, snippets])

  const getLinks = () => {
    const links: NavLinkData[] = [
      {
        title: 'Search',
        path: ROUTE_PATHS.search,
        shortcut: shortcuts.showSearch.keystrokes,
        icon: GetIcon(searchLine)
      },
      // {
      //   title: 'Dashboard',
      //   path: ROUTE_PATHS.dashborad,
      //   icon: GetIcon(dashboardLine),
      //   isComingSoon: true
      // },
      {
        title: 'Notes',
        path: `${ROUTE_PATHS.node}/${noteId}`,
        shortcut: shortcuts.showEditor.keystrokes,
        icon: GetIcon(fileDocument),
        count: count.notes
      },

      {
        title: 'Snippets',
        path: ROUTE_PATHS.snippets,
        shortcut: shortcuts.showSnippets.keystrokes,
        icon: GetIcon(quillPenLine),
        count: count.snippets
      },
      {
        title: 'Tasks',
        path: ROUTE_PATHS.tasks,
        icon: GetIcon(checkboxLine),
        shortcut: shortcuts.showTasks.keystrokes,
        count: count.tasks
        // isComingSoon: true
      },
      {
        title: 'Integrations',
        path: ROUTE_PATHS.integrations,
        shortcut: shortcuts.showIntegrations.keystrokes,
        icon: GetIcon(appsLine)
      },
      {
        title: 'Reminders',
        path: ROUTE_PATHS.reminders,
        icon: GetIcon(timerFlashLine),
        count: count.reminders
        // shortcut: shortcuts.showReminder.keystrokes
        // isComingSoon: true
      }
      /*{
        title: 'Flows',
        path: ROUTE_PATHS.integrations,
        // shortcut: shortcuts.showIntegrations.keystrokes,
        icon: GetIcon(appsLine),
        isComingSoon: true
      }*/
    ]
    return links
  }

  return { getLinks }
}

export default useNavlinks
