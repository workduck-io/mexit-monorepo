import { useMatch } from 'react-router-dom'

import { ROUTE_PATHS } from '../../Hooks/useRouting'
import { useLayoutStore } from '../../Stores/useLayoutStore'
import ArchiveSidebar from './ArchiveSidebar'
import { PublicNoteSidebar } from './PublicSidebar.notes'
import { NoteSidebar } from './Sidebar.notes'
import SnippetList from './SnippetList'
import TagList from './TagList'
import TaskViewList from './TaskViewList'

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
  const isPublicNamespaceView = useMatch(`${ROUTE_PATHS.namespaceShare}/:namespaceid/*`)

  // mog('IS SIDEBAR', { sidebar, isEditor, isArchive })

  if (!sidebar.show) return <></>

  if (isPublicNamespaceView) return <PublicNoteSidebar />

  if (isEditor) return <NoteSidebar />

  if (isSnippet || isSnippetNote) return <SnippetList />

  if (isArchive || isArchiveEditor) return <ArchiveSidebar />

  if (isTasks || isTasksView) return <TaskViewList />

  if (isTagsView) return <TagList />

  return <> </>
}

export default SidebarTabs
