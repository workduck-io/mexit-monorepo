import React, { useMemo } from 'react'

import { Icon } from '@iconify/react'
import filter2Line from '@iconify-icons/ri/filter-2-line'
import filterOffLine from '@iconify-icons/ri/filter-off-line'
import { nanoid } from 'nanoid'

import { Infobox, ToolbarTooltip } from '@workduck-io/mex-components'
import { Entities } from '@workduck-io/mex-search'

import { Filter, Filters, GlobalFilterJoin } from '@mexit/core'
import {
  SearchFilterCancel,
  SearchFilterLabel,
  SearchFiltersHelp,
  SearchFiltersWrapper,
  SearchFilterWrapper
} from '@mexit/shared'

import EntityFilterMenu from '../Components/Filters/EntityFilterMenu'
import FilterRender from '../Components/Filters/Filter'
import GroupByMenu from '../Components/Filters/GroupBy'
import NewFilterMenu from '../Components/Filters/NewFilterMenu'
import SortMenu, { SortMenuProps } from '../Components/Filters/SortMenu'

import ViewSelector, { ViewSelectorProps } from './ViewSelector'

interface SearchFiltersProps {
  filters: Filters
  currentFilters: Filter[]
  onEntityFilterChange?: (entitiy: Entities) => void
  globalJoin: GlobalFilterJoin
  setGlobalJoin: (join: GlobalFilterJoin) => void
  addCurrentFilter: (filter: Filter) => void
  removeCurrentFilter: (filter: Filter) => void
  changeCurrentFilter: (filter: Filter) => void
  resetCurrentFilters: () => void
  viewSelectorProps?: ViewSelectorProps
  onGroupByChange?: (groupBy: string) => void
  sortMenuProps?: SortMenuProps
}

const SearchFilters = ({
  filters,
  currentFilters,
  addCurrentFilter,
  changeCurrentFilter,
  removeCurrentFilter,
  resetCurrentFilters,
  onEntityFilterChange,
  onGroupByChange,
  viewSelectorProps,
  sortMenuProps
}: SearchFiltersProps) => {
  const randomId = useMemo(() => nanoid(), [filters, currentFilters])

  const removeLastFilter = () => {
    if (currentFilters.length > 0) {
      const lastFilter = currentFilters[currentFilters.length - 1]
      removeCurrentFilter(lastFilter)
    }
  }

  return (
    <SearchFilterWrapper>
      <SearchFilterLabel>
        {currentFilters.length > 0 ? (
          <ToolbarTooltip content={'Clear all filters'}>
            <SearchFilterCancel onClick={() => resetCurrentFilters()}>
              <Icon icon={filterOffLine} />
            </SearchFilterCancel>
          </ToolbarTooltip>
        ) : (
          <Icon icon={filter2Line} />
        )}
        <Infobox text={SearchFiltersHelp} />
      </SearchFilterLabel>
      <SearchFiltersWrapper key={`Filters_${randomId}`}>
        {currentFilters.map((filter) => {
          return (
            <FilterRender
              key={`${filter.id}_${filter.type}`}
              filter={filter}
              options={filters.find((f) => f.type === filter.type)?.options}
              onChangeFilter={(f) => changeCurrentFilter(f)}
              onRemoveFilter={(f) => removeCurrentFilter(f)}
            />
          )
        })}
        <NewFilterMenu filters={filters} addFilter={(f) => addCurrentFilter(f)} removeLastFilter={removeLastFilter} />
      </SearchFiltersWrapper>
      {onEntityFilterChange && <EntityFilterMenu onChange={onEntityFilterChange} />}
      {onGroupByChange && <GroupByMenu onChange={onGroupByChange} />}
      {sortMenuProps && <SortMenu {...sortMenuProps} />}
      {viewSelectorProps && <ViewSelector {...viewSelectorProps} />}
    </SearchFilterWrapper>
  )
}

export default SearchFilters
