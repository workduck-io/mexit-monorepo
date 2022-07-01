import React, { useMemo } from 'react'
import { nanoid } from 'nanoid'
import { startCase } from 'lodash'
import { Icon } from '@iconify/react'
import filterOffLine from '@iconify-icons/ri/filter-off-line'
import filter2Line from '@iconify-icons/ri/filter-2-line'

import { mog, FilterKey, SearchFilter } from '@mexit/core'
import {
  SearchFilterCancel,
  SearchFilterCategoryLabel,
  SearchFilterCount,
  SearchFilterLabel,
  SearchFilterList,
  SearchFilterListCurrent,
  SearchFilterListSuggested,
  SearchFilterListWrap,
  SearchFilterStyled,
  SearchFilterWrapper
} from '@mexit/shared'

import Infobox from '../Components/Infobox'
import { SearchFiltersHelp } from '../Data/defaultText'
import SearchFilterInput from '../Components/SearchFilterInput'

interface SearchFiltersProps<Item> {
  result?: any
  filters: SearchFilter<Item>[]
  currentFilters: SearchFilter<Item>[]
  addCurrentFilter: (filter: SearchFilter<Item>) => void
  removeCurrentFilter: (filter: SearchFilter<Item>) => void
  resetCurrentFilters: () => void
}

const getGroupedFilters = <Item,>(filters: SearchFilter<Item>[], currentFilters: SearchFilter<Item>[]) => {
  const randomId = nanoid()
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
        <Icon icon={filter2Line} />
        Filter By
      </SearchFilterLabel>
      {Object.entries(filtersByKey)
        .sort(([key1], [key2]) => startCase(key1).localeCompare(startCase(key2)))
        .map(([k, filter]) => {
          return (
            <SearchFilterList key={`filter_options${k}`}>
              <SearchFilterCategoryLabel>{startCase(k)}:</SearchFilterCategoryLabel>

              <SearchFilterListWrap>
                {filter.current.length > 0 && (
                  <SearchFilterListCurrent>
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
                        {f.count && <SearchFilterCount>{f.count}</SearchFilterCount>}
                      </SearchFilterStyled>
                    ))}
                  </SearchFilterListCurrent>
                )}
                {filter.suggested.length > 0 && (
                  <SearchFilterListSuggested>
                    {filter.suggested.slice(0, 5).map((f) => (
                      <SearchFilterStyled
                        key={`suggested_f_${f.id}`}
                        onClick={() => {
                          addCurrentFilter(f)
                          // updateResults()
                        }}
                      >
                        {f.icon ? <Icon icon={f.icon} /> : null}
                        {f.label}
                        {f.count && <SearchFilterCount>{f.count}</SearchFilterCount>}
                      </SearchFilterStyled>
                    ))}
                  </SearchFilterListSuggested>
                )}
              </SearchFilterListWrap>
              <SearchFilterInput
                key={`filter_input_${randomId}`}
                items={[...filter.current, ...filter.suggested]}
                onChange={(value) => {
                  toggleForFilter(value)
                }}
              />
            </SearchFilterList>
          )
        })}
      {currentFilters.length > 0 && (
        <SearchFilterCancel onClick={() => resetCurrentFilters()}>
          <Icon icon={filterOffLine} />
          Reset
        </SearchFilterCancel>
      )}
      <Infobox text={SearchFiltersHelp} />
    </SearchFilterWrapper>
  )
}

export default SearchFilters
