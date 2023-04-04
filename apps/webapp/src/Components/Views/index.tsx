import { useEffect, useMemo } from 'react'

import styled from 'styled-components'

import { useDataStore, View } from '@mexit/core'
import { PageContainer, ViewSection } from '@mexit/shared'

import { useViewFilterStore } from '../../Hooks/todo/useTodoFilters'
import { useViewFilters as useFilters } from '../../Hooks/useViewFilters'
import { useViews } from '../../Hooks/useViews'
import { useViewStore } from '../../Stores/useViewStore'
import ViewHeader from '../TaskHeader'

import ViewSearchFilters from './ViewFilters'
import ViewRenderer from './ViewRenderer'

type ViewProps = {
  viewId: string
  withFilters?: boolean
}

export const ViewPageContainer = styled(PageContainer)`
  margin: ${({ theme }) => theme.spacing.large};
`

export const ViewContainer: React.FC<ViewProps> = ({ viewId, withFilters = true }) => {
  const _hasHydrated = useDataStore((s) => s._hasHydrated)
  const setCurrentView = useViewStore((s) => s.setCurrentView)
  const setFilters = useViewFilterStore((s) => s.setFilters)
  const initViewFilters = useViewFilterStore((s) => s.initializeState)

  const { getView } = useViews()
  const { getFilters } = useFilters()

  const activeView = useMemo(() => {
    return getView(viewId)
  }, [viewId, _hasHydrated])

  const handleViewInit = (view: View) => {
    setCurrentView(view)
    initViewFilters(view)
  }

  useEffect(() => {
    setFilters(getFilters())
  }, [])

  useEffect(() => {
    if (activeView) {
      handleViewInit(activeView)
    }
  }, [activeView])

  if (!_hasHydrated) return

  if (!withFilters) {
    return (
      <ViewSection>
        <ViewRenderer view={activeView} />
      </ViewSection>
    )
  }

  return (
    <View>
      <ViewRenderer key={activeView?.id} view={activeView} />
    </View>
  )
}

const View = ({ children }) => {
  return (
    <ViewPageContainer fade>
      <ViewHeader />
      <ViewSearchFilters />
      <ViewSection>{children}</ViewSection>
    </ViewPageContainer>
  )
}

export default View
