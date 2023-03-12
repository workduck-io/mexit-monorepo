import { Navigate, useParams } from 'react-router-dom'

import { ViewContainer } from '../../Components/Views'
import { ROUTE_PATHS } from '../../Hooks/useRouting'

const ViewPage = () => {
  const viewId = useParams()?.viewid

  if (!viewId) {
    return <Navigate to={{ pathname: ROUTE_PATHS.tasks }} replace />
  }

  return <ViewContainer viewId={viewId} />
}

export default ViewPage
