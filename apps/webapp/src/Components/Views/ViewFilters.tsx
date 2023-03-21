import { Entities } from '@workduck-io/mex-search'

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
    onGroupByChange,
    entities,
    resetCurrentFilters,
    onSortOrderChange,
    onChangeEntities,
    onSortTypeChange
  } = useViewFilters()

  return (
    <SearchFilters
      addCurrentFilter={addCurrentFilter}
      removeCurrentFilter={removeCurrentFilter}
      changeCurrentFilter={changeCurrentFilter}
      resetCurrentFilters={resetCurrentFilters}
      filters={filters}
      onEntityFilterChange={(entity: Entities) => {
        if (entities.includes(entity)) {
          onChangeEntities(entities.filter((e) => e !== entity))
        } else {
          onChangeEntities([...entities, entity])
        }
      }}
      currentFilters={currentFilters}
      globalJoin={globalJoin}
      setGlobalJoin={setGlobalJoin}
      onGroupByChange={onGroupByChange}
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
        onSortOrderChange
      }}
    />
  )
}

export default ViewSearchFilters
