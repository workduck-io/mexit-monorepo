import { ViewType } from '@mexit/core'

import KanbanView from './KanbanView'
import ListView from './ListView'

const ViewRenderer: React.FC<{ viewType: ViewType }> = ({ viewType }) => {
  switch (viewType) {
    case ViewType.Kanban:
      return <KanbanView />
    case ViewType.List:
      return <ListView />
    default:
      return <ListView />
  }
}

export default ViewRenderer
