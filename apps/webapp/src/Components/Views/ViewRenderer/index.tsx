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

const ViewSectionRenderer: React.FC<ViewRendererProps> = (props) => {
  const items = useViewResults(props?.view?.path)
  const type = useViewFilterStore((s) => s.viewType)

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
          const snapshotKey = `${workspace}/${viewId}`

          S3FileUploadClient(JSON.stringify(items), {
            fileName: snapshotKey,
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
    }
  }, [isPublishable])

  return <ViewTypeRenderer type={type} items={items} />
}

export const ViewTypeRenderer = ({ type, items, ...props }) => {
  switch (type) {
    case ViewType.Kanban:
      return <KanbanView results={items} {...props} />
    case ViewType.List:
    default:
      return <ListView results={items} {...props} />
  }
}

const ViewRenderer: React.FC<ViewRendererProps> = (props) => {
  return (
    <ErrorBoundary fallbackRender={() => <></>}>
      <ViewSectionRenderer {...props} />
    </ErrorBoundary>
  )
}

export default ViewRenderer
