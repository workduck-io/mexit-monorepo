import { useMatch } from 'react-router-dom'

import { ROUTE_PATHS } from '../../Hooks/useRouting'
import { useLayoutStore } from '../../Stores/useLayoutStore'

import { PublicNoteSidebar } from './PublicSidebar.notes'
import { NoteSidebar } from './Sidebar.notes'
import { SnippetSidebar } from './Sidebar.snippets'
import TagList from './TagList'
import TaskViewList from './TaskViewList'

const SidebarTabs = () => {
  const sidebar = useLayoutStore((store) => store.sidebar)
  const isEditor = useMatch(`${ROUTE_PATHS.node}/:nodeid`)
  const isSnippetNote = useMatch(`${ROUTE_PATHS.snippet}/:snippetid`)
  const isPromptRoute = useMatch(`${ROUTE_PATHS.prompt}/:promptId`)
  const isSnippet = useMatch(ROUTE_PATHS.snippets)
  const isTagsView = useMatch(`${ROUTE_PATHS.tag}/:tag`)
  const isTasks = useMatch(ROUTE_PATHS.tasks)
  const isReminder = useMatch(ROUTE_PATHS.reminders)
  const isTasksView = useMatch(`${ROUTE_PATHS.tasks}/:viewid`)
  const isPublicNamespaceView = useMatch(`${ROUTE_PATHS.namespaceShare}/:namespaceid/*`)

  // mog('IS SIDEBAR', { show: sidebar.show })

  if (!sidebar.show) return <></>

  if (isPublicNamespaceView) return <PublicNoteSidebar />

  if (isEditor) return <NoteSidebar />

  if (isSnippet || isSnippetNote || isPromptRoute) return <SnippetSidebar />

  // if (isArchive || isArchiveEditor) return <ArchiveSidebar />

  if (isTasks || isTasksView || isReminder) return <TaskViewList />

  if (isTagsView) return <TagList />

  return <> </>
}

export default SidebarTabs
