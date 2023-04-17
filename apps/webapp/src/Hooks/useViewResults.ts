import { useEffect, useMemo, useState } from 'react'

import { Indexes, SearchResult } from '@workduck-io/mex-search'

import { useContentStore } from '@mexit/core'
import { groupItems, keysToExcludeInGrouping, keysToExcludeInSorting, useQuery } from '@mexit/shared'

import { useViewFilterStore } from './todo/useTodoFilters'
import { useSearch } from './useSearch'
import { useViewFilters } from './useViewFilters'
import { useViews } from './useViews'

const useViewResults = (path: string) => {
  const [results, setResults] = useState<SearchResult[]>([])

  const { queryIndex } = useSearch()
  const { getParentViewFilters } = useViews()
  const { generateFilterSetQuery } = useQuery()
  const { getGroupingOptions } = useViewFilters()

  const docUpdated = useContentStore((store) => store.docUpdated)
  const entities = useViewFilterStore((store) => store.entities)
  const groupedBy = useViewFilterStore((store) => store.groupBy)
  const sortBy = useViewFilterStore((store) => store.sortType)
  const sortOrder = useViewFilterStore((store) => store.sortOrder)
  const onGroupByChange = useViewFilterStore((store) => store.setGroupBy)
  const setSortOptions = useViewFilterStore((store) => store.setSortOptions)
  const currentFilters = useViewFilterStore((store) => store.currentFilters)
  const setGroupingOptions = useViewFilterStore((store) => store.setGroupingOptions)

  const groupedResults = useMemo(() => {
    const { options, groupBy: newGroupByKey } = getGroupingOptions(results)

    setSortOptions(options.filter((option) => !keysToExcludeInSorting.includes(option.label)))
    const groupingOptions = options.filter((option) => !keysToExcludeInGrouping.includes(option.label))
    setGroupingOptions(groupingOptions)

    const groupBy = groupedBy ?? newGroupByKey
    onGroupByChange(groupBy)

    return groupItems(results, { groupBy, sortBy, sortOrder })
  }, [groupedBy, sortBy, sortOrder, results])

  useEffect(() => {
    const parentFilters = getParentViewFilters(path)?.map((v) => v.filters)
    const filterSetQuery = currentFilters?.length > 0 ? [...parentFilters, currentFilters] : parentFilters
    const query = generateFilterSetQuery(filterSetQuery, entities)

    if (query.length) {
      queryIndex(Indexes.MAIN, query).then((queryResult) => {
        if (queryResult) {
          setResults(queryResult)
        }
      })
    } else setResults([])
  }, [currentFilters, entities, docUpdated])

  return groupedResults
}

export default useViewResults
