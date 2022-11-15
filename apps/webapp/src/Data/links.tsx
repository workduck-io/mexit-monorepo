import React, { useMemo } from 'react'

import fileDocument from '@iconify/icons-gg/file-document'
import appsLine from '@iconify/icons-ri/apps-line'
import checkboxLine from '@iconify/icons-ri/checkbox-line'
import linkM from '@iconify/icons-ri/link-m'
import quillPenLine from '@iconify/icons-ri/quill-pen-line'
import { Icon } from '@iconify/react'
import { useMatch } from 'react-router-dom'

import { ROUTE_PATHS } from '../Hooks/useRouting'
import { useViewStore } from '../Hooks/useTaskViews'
import { useEditorStore } from '../Stores/useEditorStore'
import { useHelpStore } from '../Stores/useHelpStore'
import { NavLinkData } from '../Types/Nav'
import { useDataStore } from '../Stores/useDataStore'
import { InitialNode, mog } from '@mexit/core'

/*
Sidebar links are defined here
*/

// Disabled as IconifyIcon type doesn't work
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const GetIcon = (icon: any): React.ReactNode => <Icon icon={icon} />

const useNavlinks = () => {
  const shortcuts = useHelpStore((store) => store.shortcuts)

  const baseNodeId = useDataStore((store) => store.baseNodeId)
  const match = useMatch(`${ROUTE_PATHS.node}/:nodeid`)
  const nodeid = useMemo(() => {
    const editorNode = useEditorStore.getState().node
    // mog('match', { match, baseNodeId, editorNode })
    if (match?.params?.nodeid) {
      return match.params.nodeid
    } else if (editorNode && editorNode.nodeid !== InitialNode.nodeid) {
      return editorNode.nodeid
    } else if (baseNodeId) {
      return baseNodeId
    }
  }, [match, baseNodeId])

  // const count = useMemo(() => getLinkCount(), [reminders, ilinks, archive, tasks])

  /* Find current view if available */
  const matchViewPath = useMatch(`${ROUTE_PATHS.tasks}/:viewid`)
  const viewid = matchViewPath?.params?.viewid || useViewStore.getState().currentView?.id

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
        path: viewid ? `${ROUTE_PATHS.tasks}/${viewid}` : ROUTE_PATHS.tasks,
        icon: GetIcon(checkboxLine),
        shortcut: shortcuts.showTasks.keystrokes
        // count: count.tasks
        // isComingSoon: true
      },
      // { //NOTE: Doing away with the dedicated reminder view. Keeping for future reference
      //   title: 'Reminders',
      //   path: ROUTE_PATHS.reminders,
      //   icon: GetIcon(timerFlashLine),
      //   // count: count.reminders
      //   shortcut: shortcuts.showReminder.keystrokes
      //   // isComingSoon: true
      // },
      {
        title: 'Links',
        path: ROUTE_PATHS.links,
        icon: GetIcon(linkM),
        // count: count.reminders
        shortcut: shortcuts.goToLinks.keystrokes
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
