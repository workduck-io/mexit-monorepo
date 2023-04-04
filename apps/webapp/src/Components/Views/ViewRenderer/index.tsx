import { ErrorBoundary } from 'react-error-boundary'

import { SearchResult } from '@workduck-io/mex-search'

import { MIcon, View, ViewType } from '@mexit/core'

import { useViewFilterStore } from '../../../Hooks/todo/useTodoFilters'
import useViewResults from '../../../Hooks/useViewResults'

import KanbanView from './KanbanView'
import ListView from './ListView'

export interface ViewRendererProps {
  view: View
}

export type GroupedResult = {
  label: string
  icon: MIcon
  type: string
  items: SearchResult[]
}

const ViewTypeRenderer: React.FC<ViewRendererProps> = (props) => {
  const viewType = useViewFilterStore((s) => s.viewType)
  const results = useViewResults(props?.view?.path)

  switch (viewType) {
    case ViewType.Kanban:
      return <KanbanView results={results} {...props} />
    case ViewType.List:
    default:
      return <ListView results={results} {...props} />
  }
}

const ViewRenderer: React.FC<ViewRendererProps> = (props) => {
  return (
    <ErrorBoundary fallbackRender={() => <></>}>
      <ViewTypeRenderer {...props} />
    </ErrorBoundary>
  )
}

export default ViewRenderer
