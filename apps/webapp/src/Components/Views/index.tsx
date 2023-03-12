import { useEffect } from 'react'

import { PageContainer, ViewSection } from '@mexit/shared'

import { useViewFilters, useViewFilterStore } from '../../Hooks/todo/useTodoFilters'
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
  const viewType = useViewFilterStore((store) => store.viewType)
  const setCurrentView = useViewStore((s) => s.setCurrentView)

  const { getView } = useViews()
  const { getFilters } = useFilters()
  const { setFilters, initViewFilters } = useViewFilters()

  const handleViewInit = (viewId: string) => {
    const activeView = getView(viewId)
    setCurrentView(activeView)
    initViewFilters(activeView)
  }

  useEffect(() => {
    setFilters(getFilters())
  }, [])

  useEffect(() => {
    handleViewInit(viewId)
  }, [viewId])

  return (
    <View>
      <ViewRenderer viewId={viewId} viewType={viewType} />
    </View>
  )
}

const View = ({ children }) => {
  return (
    <PageContainer>
      <ViewHeader cardSelected={false} />
      <ViewSearchFilters />
      <ViewSection>{children}</ViewSection>
    </PageContainer>
  )
}

export default View
