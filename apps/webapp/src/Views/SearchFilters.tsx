import React, { useMemo } from 'react'

import filter2Line from '@iconify-icons/ri/filter-2-line'
import filterOffLine from '@iconify-icons/ri/filter-off-line'
import { Icon } from '@iconify/react'
import { startCase } from 'lodash'
import { nanoid } from 'nanoid'

import { mog, FilterKey, SearchFilter } from '@mexit/core'
import {
  SearchFilterCancel,
  SearchFilterLabel,
  SearchFilterList,
  SearchFiltersWrapper,
  SearchFilterWrapper,
  ToolbarTooltip
} from '@mexit/shared'

import Infobox from '../Components/Infobox'
import SearchFilterInput from '../Components/SearchFilterInput'
import { SearchFiltersHelp } from '../Data/defaultText'

interface SearchFiltersProps<Item> {
  result?: any
  filters: SearchFilter<Item>[]
  currentFilters: SearchFilter<Item>[]
  addCurrentFilter: (filter: SearchFilter<Item>) => void
  removeCurrentFilter: (filter: SearchFilter<Item>) => void
  resetCurrentFilters: () => void
}

const filterIcons: Partial<{ [key in FilterKey]: string }> = {
  note: 'ri:file-list-2-line',
  tag: 'ri:hashtag',
  mention: 'ri:at-line'
}

const getGroupedFilters = <Item,>(filters: SearchFilter<Item>[], currentFilters: SearchFilter<Item>[]) => {
  const randomId = nanoid()
  // Remove current filters from filters
  const suggestedFilters = filters.filter(
    (filter) => !currentFilters.find((currentFilter) => currentFilter.id === filter.id)
  )

  const filtersByKey: Partial<{
    [key in FilterKey]: {
      current: SearchFilter<Item>[]
      suggested: SearchFilter<Item>[]
    }
  }> = {}

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

  // Object.entries(filtersByKey).forEach(([key, { current, suggested }]) => {
  //   if (suggested.length > 5) {
  //     filtersByKey[key].suggested = suggested.slice(0, 5)
  //   }
  // })

  return { filtersByKey, randomId }
}

const SearchFilters = <Item,>({
  filters,
  currentFilters,
  addCurrentFilter,
  result,
  removeCurrentFilter,
  resetCurrentFilters
}: SearchFiltersProps<Item>) => {
  const { filtersByKey, randomId } = useMemo(
    () => getGroupedFilters(filters, currentFilters),
    [filters, currentFilters, result]
  )

  mog('SearchFilters', { filters, currentFilters, filtersByKey })

  const toggleForFilter = (filter: SearchFilter<Item>) => {
    if (currentFilters.find((currentFilter) => currentFilter.id === filter.id)) {
      // mog('removeCurrentFilter', { filter })
      removeCurrentFilter(filter)
    } else {
      // mog('addCurrentFilter', { filter })
      addCurrentFilter(filter)
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
      <SearchFiltersWrapper>
        {Object.entries(filtersByKey)
          .sort(([key1], [key2]) => startCase(key1).localeCompare(startCase(key2)))
          .map(([k, filter]) => {
            return (
              <SearchFilterList key={`filter_options${k}`}>
                <SearchFilterInput
                  key={`filter_input_${randomId}`}
                  filterKey={k as FilterKey}
                  currentFilters={filter.current}
                  removeCurrentFilter={removeCurrentFilter}
                  items={[...filter.current, ...filter.suggested]}
                  placeholder={`Filter by ${startCase(k)} ...`}
                  icon={filterIcons[k] ?? 'ri:filter-2-line'}
                  onChange={(value) => {
                    toggleForFilter(value)
                  }}
                />
              </SearchFilterList>
            )
          })}
      </SearchFiltersWrapper>
    </SearchFilterWrapper>
  )
}

export default SearchFilters
