import { SearchResult } from '@workduck-io/mex-search'

import { MIcon, ViewType } from '@mexit/core'

import KanbanView from './KanbanView'
import ListView from './ListView'

export interface ViewRendererProps {
  viewId: string
  viewType?: ViewType
}

export type GroupedResult = {
  label: string
  icon: MIcon
  type: string
  items: SearchResult[]
}

const ViewRenderer: React.FC<ViewRendererProps> = (props) => {
  switch (props.viewType) {
    case ViewType.Kanban:
      return <KanbanView />
    case ViewType.List:
    default:
      return <ListView {...props} />
  }
}

export default ViewRenderer
