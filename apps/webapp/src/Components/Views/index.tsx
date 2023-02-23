import { useParams } from 'react-router-dom'

import { PageContainer, ViewSection } from '@mexit/shared'

import SearchFilters from '../../Views/SearchFilters'
import ViewHeader from '../TaskHeader'

import ViewRenderer from './ViewRenderer'

const View = () => {
  const viewId = useParams()?.viewid

  return (
    <PageContainer>
      <ViewHeader
        sortOrder={sortOrder}
        sortType={sortType}
        currentViewType={viewType}
        currentFilters={currentFilters}
        cardSelected={false}
        currentView={currentView}
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
