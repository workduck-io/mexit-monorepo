import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { ViewType } from '@mexit/core'
import { PageContainer, ViewSection } from '@mexit/shared'

import { useViewFilters } from '../../Hooks/todo/useTodoFilters'
import { useViewFilters as useFilters } from '../../Hooks/useViewFilters'
import SearchFilters from '../../Views/SearchFilters'
import ViewHeader from '../TaskHeader'

import ViewRenderer from './ViewRenderer'

const View = () => {
  const viewId = useParams()?.viewid

  const { getFilters } = useFilters()

  const {
    sortOrder,
    sortType,
    viewType,
    currentFilters,
    setFilters,
    filters,
    globalJoin,
    setGlobalJoin,
    onViewTypeChange,
    addCurrentFilter,
    removeCurrentFilter,
    changeCurrentFilter,
    resetCurrentFilters,
    onSortOrderChange,
    onSortTypeChange
  } = useViewFilters()

  useEffect(() => {
    setFilters(getFilters())
  }, [])

  return (
    <PageContainer>
      <ViewHeader
        sortOrder={sortOrder}
        sortType={sortType}
        currentViewType={viewType}
        currentFilters={currentFilters}
        cardSelected={false}
        globalJoin={globalJoin}
      />
      <SearchFilters
        addCurrentFilter={addCurrentFilter}
        removeCurrentFilter={removeCurrentFilter}
        changeCurrentFilter={changeCurrentFilter}
        resetCurrentFilters={resetCurrentFilters}
        filters={filters}
        currentFilters={currentFilters}
        globalJoin={globalJoin}
        setGlobalJoin={setGlobalJoin}
        viewSelectorProps={{
          currentView: viewType,
          onChangeView: (viewType) => {
            onViewTypeChange(viewType)
          },
          availableViews: [ViewType.Kanban, ViewType.List]
        }}
        sortMenuProps={{
          sortOrder,
          sortType,
          onSortTypeChange,
          onSortOrderChange,
          availableSortTypes: ['status', 'priority']
        }}
      />
      <ViewSection>
        <ViewRenderer viewId={viewId} />
      </ViewSection>
    </PageContainer>
  )
}

export default View
