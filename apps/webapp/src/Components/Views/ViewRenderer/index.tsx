import { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { toast } from 'react-hot-toast'

import { S3FileUploadClient } from '@workduck-io/dwindle'
import { SearchResult } from '@workduck-io/mex-search'

import { MIcon, useAuthStore, useShareModalStore, useViewStore, View, ViewType } from '@mexit/core'

import { useViewAPI } from '../../../Hooks/API/useViewsAPI'
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
  const results = useViewResults(props?.view?.path)
  const viewType = useViewFilterStore((s) => s.viewType)
  const isPublishable = useShareModalStore((store) => store.data.share)
  const publishCurrentView = useShareModalStore((store) => store.updateData)
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const updatePublishView = useViewStore((store) => store.publishView)

  const { publishViewAPI } = useViewAPI()

  useEffect(() => {
    if (isPublishable) {
      const viewId = useShareModalStore.getState().data.id
      const view = useViewStore.getState().views.find((v) => v.id === viewId)

      publishViewAPI(view, true)
        .then(() => {
          const workspace = getWorkspaceId()

          S3FileUploadClient(JSON.stringify(results), {
            fileName: `${workspace}/${viewId}`,
            public: true
          })
            .then((res) => {
              updatePublishView(viewId, true)
            })
            .catch((err) => {
              toast('Something went wrong while publishing the view')
              console.error('Unable to take View Snapshot', err)
            })
        })
        .catch((err) => {
          toast('Something went wrong while publishing the view')
          console.error('Unable to publish view', err)
        })
        .finally(() => {
          publishCurrentView({
            share: false
          })
        })
    } else {
      const viewId = useShareModalStore.getState().data.id
      const view = useViewStore.getState().views.find((v) => v.id === viewId)
      publishViewAPI(view, false).then(() => {
        updatePublishView(viewId, false)
      })
    }
  }, [isPublishable])

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
