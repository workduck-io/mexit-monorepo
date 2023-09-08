import { useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import { ViewContainer } from '../../Components/Views'
import { ViewFilterProvider, viewFilterStore } from '../../Hooks/todo/useTodoFilters'
import { useEditorBuffer } from '../../Hooks/useEditorBuffer'
import { ROUTE_PATHS } from '../../Hooks/useRouting'

const ViewPage = () => {
  const viewId = useParams()?.viewid
  const { saveAndClearBuffer } = useEditorBuffer()

  if (!viewId) {
    return <Navigate to={{ pathname: ROUTE_PATHS.tasks }} replace />
  }

  useEffect(() => {
    return () => {
      saveAndClearBuffer(false)
    }
  }, [])

  return (
    <ViewFilterProvider createStore={viewFilterStore}>
      <ViewContainer viewId={viewId} />
    </ViewFilterProvider>
  )
}

export default ViewPage
