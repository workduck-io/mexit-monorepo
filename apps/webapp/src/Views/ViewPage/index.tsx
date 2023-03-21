import { Navigate, useParams } from 'react-router-dom'

import { ViewContainer } from '../../Components/Views'
import { createViewFilterStore, ViewFilterProvider } from '../../Hooks/todo/useTodoFilters'
import { ROUTE_PATHS } from '../../Hooks/useRouting'

const ViewPage = () => {
  const viewId = useParams()?.viewid

  if (!viewId) {
    return <Navigate to={{ pathname: ROUTE_PATHS.tasks }} replace />
  }

  return (
    <ViewFilterProvider createStore={createViewFilterStore}>
      <ViewContainer viewId={viewId} />
    </ViewFilterProvider>
  )
}

export default ViewPage
