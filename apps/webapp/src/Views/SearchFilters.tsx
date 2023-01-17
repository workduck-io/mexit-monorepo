import React, { useMemo } from 'react'

import { Icon } from '@iconify/react'
import filter2Line from '@iconify-icons/ri/filter-2-line'
import filterOffLine from '@iconify-icons/ri/filter-off-line'
import { nanoid } from 'nanoid'

import { Infobox, ToolbarTooltip } from '@workduck-io/mex-components'

import { Filter, Filters, GlobalFilterJoin } from '@mexit/core'
import {
  SearchFilterCancel,
  SearchFilterLabel,
  SearchFiltersHelp,
  SearchFiltersWrapper,
  SearchFilterWrapper
} from '@mexit/shared'

import FilterRender from '../Components/Filters/Filter'
import GlobalJoinFilterMenu from '../Components/Filters/GlobalJoinFilterMenu'
import NewFilterMenu from '../Components/Filters/NewFilterMenu'

import ViewSelector, { ViewSelectorProps } from './ViewSelector'

interface SearchFiltersProps {
  filters: Filters
  currentFilters: Filter[]
  globalJoin: GlobalFilterJoin
  setGlobalJoin: (join: GlobalFilterJoin) => void
  addCurrentFilter: (filter: Filter) => void
  removeCurrentFilter: (filter: Filter) => void
  changeCurrentFilter: (filter: Filter) => void
  resetCurrentFilters: () => void
  // If present, a view Selector is added at the end with the given properties
  viewSelectorProps?: ViewSelectorProps
}

const SearchFilters = ({
  filters,
  currentFilters,
  addCurrentFilter,
  changeCurrentFilter,
  removeCurrentFilter,
  resetCurrentFilters,
  globalJoin,
  setGlobalJoin,
  viewSelectorProps
}: SearchFiltersProps) => {
  const randomId = useMemo(() => nanoid(), [filters, currentFilters])

  // mog('SearchFilters', { filters, currentFilters, filtersByKey })
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
        <NewFilterMenu filters={filters} addFilter={(f) => addCurrentFilter(f)} removeLastFilter={removeLastFilter} />
        {currentFilters.map((filter) => (
          <FilterRender
            key={`${filter.id}_${filter.type}`}
            filter={filter}
            options={filters.find((f) => f.type === filter.type)?.options}
            onChangeFilter={(f) => changeCurrentFilter(f)}
            onRemoveFilter={(f) => removeCurrentFilter(f)}
          />
        ))}
      </SearchFiltersWrapper>
      <GlobalJoinFilterMenu globalJoin={globalJoin} setGlobalJoin={setGlobalJoin} />
      <ViewSelector {...viewSelectorProps} />
    </SearchFilterWrapper>
  )
}

export default SearchFilters
