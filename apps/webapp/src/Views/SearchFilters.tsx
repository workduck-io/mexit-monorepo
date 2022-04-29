import React, { useMemo } from 'react'
import filterOffLine from '@iconify-icons/ri/filter-off-line'
import filter2Line from '@iconify-icons/ri/filter-2-line'
import { FilterKey, SearchFilter } from '../Hooks/useFilters'
import {
  SearchFilterCancel,
  SearchFilterCategoryLabel,
  SearchFilterLabel,
  SearchFilterList,
  SearchFilterStyled,
  SearchFilterWrapper
} from '../Style/Search'
import { startCase } from 'lodash'
import { Icon } from '@iconify/react'

interface SearchFiltersProps<Item> {
  result?: any
  filters: SearchFilter<Item>[]
  currentFilters: SearchFilter<Item>[]
  addCurrentFilter: (filter: SearchFilter<Item>) => void
  removeCurrentFilter: (filter: SearchFilter<Item>) => void
  resetCurrentFilters: () => void
}

const getGroupedFilters = <Item,>(filters: SearchFilter<Item>[], currentFilters: SearchFilter<Item>[]) => {
  // Remove current filters from filters
  const suggestedFilters = filters.filter(
    (filter) => !currentFilters.find((currentFilter) => currentFilter.id === filter.id)
  )

  const filtersByKey: {
    [key: string]: {
      current: SearchFilter<Item>[]
      suggested: SearchFilter<Item>[]
    }
  } = {}

  suggestedFilters.forEach((filter) => {
    const key = filter.key as FilterKey
    if (!filtersByKey[key]) {
      filtersByKey[key] = {
        current: [],
        suggested: []
      }
    }
    filtersByKey[key].suggested.push(filter)
  })

  currentFilters.forEach((filter) => {
    const key = filter.key as FilterKey
    if (!filtersByKey[key]) {
      filtersByKey[key] = {
        current: [],
        suggested: []
      }
    }
    filtersByKey[key].current.push(filter)
  })

  Object.entries(filtersByKey).forEach(([key, { current, suggested }]) => {
    if (suggested.length > 5) {
      filtersByKey[key].suggested = suggested.slice(0, 5)
    }
  })

  return { filtersByKey }
}

const SearchFilters = <Item,>({
  filters,
  currentFilters,
  addCurrentFilter,
  result,
  removeCurrentFilter,
  resetCurrentFilters
}: SearchFiltersProps<Item>) => {
  const { filtersByKey } = useMemo(() => getGroupedFilters(filters, currentFilters), [filters, currentFilters, result])
  // mog('SearchFilters', { filters, currentFilters, filtersByKey })

  return (
    <SearchFilterWrapper>
      <SearchFilterLabel>
        <Icon icon={filter2Line} />
        Filter By
      </SearchFilterLabel>
      {Object.entries(filtersByKey)
        .sort(([key1], [key2]) => startCase(key1).localeCompare(startCase(key2)))
        .map(([k, filter]) => {
          return (
            <SearchFilterList key={`filter_options${k}`}>
              <SearchFilterCategoryLabel>{startCase(k)}:</SearchFilterCategoryLabel>
              {filter.current.map((f) => (
                <SearchFilterStyled
                  selected
                  key={`current_f_${f.id}`}
                  onClick={() => {
                    removeCurrentFilter(f)
                    // updateResults()
                  }}
                >
                  {f.icon ? <Icon icon={f.icon} /> : null}
                  {f.label}
                </SearchFilterStyled>
              ))}
              {filter.suggested.map((f) => (
                <SearchFilterStyled
                  key={`suggested_f_${f.id}`}
                  onClick={() => {
                    addCurrentFilter(f)
                    // updateResults()
                  }}
                >
                  {f.icon ? <Icon icon={f.icon} /> : null}
                  {f.label}
                </SearchFilterStyled>
              ))}
            </SearchFilterList>
          )
        })}
      {currentFilters.length > 0 && (
        <SearchFilterCancel onClick={() => resetCurrentFilters()}>
          <Icon icon={filterOffLine} />
          Reset
        </SearchFilterCancel>
      )}
    </SearchFilterWrapper>
  )
}

export default SearchFilters
