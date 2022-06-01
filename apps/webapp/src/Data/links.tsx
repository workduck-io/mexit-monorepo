import timerFlashLine from '@iconify/icons-ri/timer-flash-line'
import checkboxLine from '@iconify/icons-ri/checkbox-line'
import quillPenLine from '@iconify/icons-ri/quill-pen-line'
import fileDocument from '@iconify/icons-gg/file-document'
import searchLine from '@iconify/icons-ri/search-line'
import { Icon } from '@iconify/react'
import React, { useMemo } from 'react'
import { ROUTE_PATHS } from '../Hooks/useRouting'
import { useHelpStore } from '../Stores/useHelpStore'
import { NavLinkData } from '../Types/Nav'
import { useEditorStore, useReminderStore, useDataStore, useTodoStore, useLinks } from '@workduck-io/mex-editor'

/*
Sidebar links are defined here
*/

// Disabled as IconifyIcon type doesn't work
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const GetIcon = (icon: any): React.ReactNode => <Icon icon={icon} />

const useNavlinks = () => {
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const nodeid = useEditorStore((store) => store.node.nodeid)
  const reminders = useReminderStore((store) => store.reminders)
  const ilinks = useDataStore((store) => store.ilinks)
  const archive = useDataStore((store) => store.archive)
  const tasks = useTodoStore((store) => store.todos)
  const { getLinkCount } = useLinks()

  const count = useMemo(() => getLinkCount(), [reminders, ilinks, archive, tasks])

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
        path: `${ROUTE_PATHS.node}/${nodeid}`,
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
      }
      // {
      // title: 'Reminders',
      // path: ROUTE_PATHS.reminders,
      // icon: GetIcon(timerFlashLine),
      // count: count.reminders
      // shortcut: shortcuts.showReminder.keystrokes
      // isComingSoon: true
      // }

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
