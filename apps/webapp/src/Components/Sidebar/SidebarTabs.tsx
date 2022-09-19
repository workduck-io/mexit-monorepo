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
import { NoteSidebar } from './Sidebar.notes'
import SnippetList from './SnippetList'
import TagList from './TagList'
import TaskViewList from './TaskViewList'
import { TreeContainer } from './Tree'

const SidebarTabs = () => {
  const sidebar = useLayoutStore((store) => store.sidebar)
  const isEditor = useMatch(`${ROUTE_PATHS.node}/:nodeid`)
  const isArchiveEditor = useMatch(`${ROUTE_PATHS.archive}/:nodeid`)
  const isArchive = useMatch(ROUTE_PATHS.archive)
  const isSnippetNote = useMatch(`${ROUTE_PATHS.snippet}/:snippetid`)
  const isSnippet = useMatch(ROUTE_PATHS.snippets)
  const isTagsView = useMatch(`${ROUTE_PATHS.tag}/:tag`)
  const isTasks = useMatch(ROUTE_PATHS.tasks)
  const isTasksView = useMatch(`${ROUTE_PATHS.tasks}/:viewid`)

  mog('IS SIDEBAR', { sidebar, isEditor, isArchive })

  if (!sidebar.show) return <></>

  if (isEditor) return <NoteSidebar />

  if (isSnippet || isSnippetNote) return <SnippetList />

  if (isArchive || isArchiveEditor) return <ArchiveSidebar />

  if (isTasks || isTasksView) return <TaskViewList />

  if (isTagsView) return <TagList />

  return <> </>
}

export default SidebarTabs
