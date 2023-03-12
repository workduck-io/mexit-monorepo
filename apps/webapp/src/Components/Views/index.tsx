import { useEffect } from 'react'

import { ReminderViewData, TasksViewData } from '@mexit/core'
import { PageContainer, ViewSection } from '@mexit/shared'

import { useViewFilters } from '../../Hooks/todo/useTodoFilters'
import { useViewFilters as useFilters } from '../../Hooks/useViewFilters'
import { useViews } from '../../Hooks/useViews'
import { useViewStore } from '../../Stores/useViewStore'
import ViewHeader from '../TaskHeader'

import ViewSearchFilters from './ViewFilters'
import ViewRenderer from './ViewRenderer'

type ViewProps = {
  viewId: string
}

export const ViewContainer: React.FC<ViewProps> = ({ viewId }) => {
  const setCurrentView = useViewStore((s) => s.setCurrentView)

  const { getView } = useViews()
  const { getFilters } = useFilters()
  const { setFilters, setCurrentFilters } = useViewFilters()

  const handleViewInit = (viewId: string) => {
    switch (viewId) {
      case TasksViewData.id:
        setCurrentView(TasksViewData)
        setCurrentFilters(TasksViewData.filters)
        break
      case ReminderViewData.id:
        setCurrentView(ReminderViewData)
        setCurrentFilters(ReminderViewData.filters)
        break
      default:
        // eslint-disable-next-line no-case-declarations
        const activeView = getView(viewId)
        setCurrentView(activeView)
        setCurrentFilters(activeView.filters)
        break
    }
  }

  useEffect(() => {
    setFilters(getFilters())
    handleViewInit(viewId)
  }, [viewId])

  return <View viewId={viewId} />
}

const View: React.FC<ViewProps> = ({ viewId }) => {
  return (
    <PageContainer>
      <ViewHeader cardSelected={false} />
      <ViewSearchFilters />
      <ViewSection>
        <ViewRenderer viewId={viewId} />
      </ViewSection>
    </PageContainer>
  )
}

export default View
