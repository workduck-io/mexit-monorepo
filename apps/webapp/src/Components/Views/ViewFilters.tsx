import { ViewType } from '@mexit/core'

import { useViewFilters } from '../../Hooks/todo/useTodoFilters'
import SearchFilters from '../../Views/SearchFilters'

const ViewSearchFilters = () => {
  const {
    sortOrder,
    sortType,
    viewType,
    currentFilters,
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

  return (
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
  )
}

export default ViewSearchFilters
