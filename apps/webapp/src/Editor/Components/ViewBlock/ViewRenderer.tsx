import { ViewType } from '@mexit/shared'

import { View } from '../../../Hooks/useTaskViews'

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
    case ViewType.Kanban:
      return <KanbanElement {...props} />
    case ViewType.List:
      return <TodoListElement view={props.view} />
  }
}

export default ViewRenderer
