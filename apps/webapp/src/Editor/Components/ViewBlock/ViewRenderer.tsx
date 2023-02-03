import { View, ViewType } from '@mexit/core'

import KanbanElement from './KanbanElement'
import TodoListElement from './TodoListElement'

type ViewRendererProps = {
  view: View
  viewId: string
  setView: any
}

const ViewRenderer: React.FC<ViewRendererProps> = (props) => {
  if (!props.view) return

  switch (props.view?.viewType) {
    case ViewType.List:
      return <TodoListElement view={props.view} />
    case ViewType.Kanban:
      return <KanbanElement {...props} />
    default:
      return <KanbanElement {...props} />
  }
}

export default ViewRenderer
