import { ViewType } from '@mexit/core'

import KanbanView from './KanbanView'
import ListView from './ListView'

export interface ViewRendererProps {
  viewId: string
  viewType?: ViewType
}

const ViewRenderer: React.FC<ViewRendererProps> = (props) => {
  switch (props.viewType) {
    case ViewType.Kanban:
      return <KanbanView />
    case ViewType.List:
      return <ListView {...props} />
    default:
      return <ListView {...props} />
  }
}

export default ViewRenderer
