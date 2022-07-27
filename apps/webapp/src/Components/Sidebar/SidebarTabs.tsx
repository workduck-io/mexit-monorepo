import React, { useMemo, useState } from 'react'

import { useMatch } from 'react-router-dom'
import { useTheme } from 'styled-components'

import { mog } from '@mexit/core'
import { MexIcon } from '@mexit/shared'

import { usePolling } from '../../Hooks/API/usePolling'
import { ROUTE_PATHS } from '../../Hooks/useRouting'
import { SharedNodeIcon } from '../../Icons/Icons'
import { useApiStore, PollActions } from '../../Stores/useApiStore'
import { useLayoutStore } from '../../Stores/useLayoutStore'
import Tabs, { SidebarTab, SingleTabType, TabType } from '../../Views/Tabs'
import ArchiveSidebar from './ArchiveSidebar'
import Bookmarks from './Bookmarks'
import SharedNotes from './SharedNotes'
import SnippetList from './SnippetList'
import TagList from './TagList'
import { TreeContainer } from './Tree'

const NodeSidebar = () => {
  const sidebar = useLayoutStore((store) => store.sidebar)
  const [openedTab, setOpenedTab] = useState<SingleTabType>(SidebarTab.hierarchy)
  const replaceAndAddActionToPoll = useApiStore((store) => store.replaceAndAddActionToPoll)
  const theme = useTheme()

  const tabs: Array<TabType> = useMemo(
    () => [
      {
        label: <MexIcon $noHover icon="ri:draft-line" width={24} height={24} />,
        type: SidebarTab.hierarchy,
        component: <TreeContainer />,
        tooltip: 'All Notes'
      },
      {
        label: <SharedNodeIcon fill={theme.colors.text.default} height={22} width={22} />,
        component: <SharedNotes />,
        type: SidebarTab.shared,
        tooltip: 'Shared Notes'
      },
      {
        label: <MexIcon $noHover icon="ri:bookmark-line" width={24} height={24} />,
        type: SidebarTab.bookmarks,
        component: <Bookmarks />,
        tooltip: 'Bookmarks'
      }
    ],
    [theme]
  )

  usePolling()

  return (
    <Tabs
      visible={sidebar.expanded}
      openedTab={openedTab}
      onChange={(tab) => {
        setOpenedTab(tab)
        replaceAndAddActionToPoll(tab as PollActions)
      }}
      tabs={tabs}
    />
  )
}

const SidebarTabs = () => {
  const sidebar = useLayoutStore((store) => store.sidebar)
  const isEditor = useMatch(`${ROUTE_PATHS.node}/:nodeid`)
  const isArchiveEditor = useMatch(`${ROUTE_PATHS.archive}/:nodeid`)
  const isArchive = useMatch(ROUTE_PATHS.archive)
  const isSnippetNote = useMatch(`${ROUTE_PATHS.snippet}/:snippetid`)
  const isSnippet = useMatch(ROUTE_PATHS.snippets)
  const isTagsView = useMatch(`${ROUTE_PATHS.tag}/:tag`)

  mog('IS SIDEBAR', { sidebar, isEditor, isArchive })

  if (!sidebar.show) return <></>

  if (isEditor) return <NodeSidebar />

  if (isSnippet || isSnippetNote) return <SnippetList />

  if (isArchive || isArchiveEditor) return <ArchiveSidebar />

  if (isTagsView) return <TagList />

  return <> </>
}

export default SidebarTabs
