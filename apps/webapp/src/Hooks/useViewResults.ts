import { useEffect, useMemo, useState } from 'react'

import { SearchResult } from '@workduck-io/mex-search'

import { groupItems, keysToExcludeInGrouping, keysToExcludeInSorting } from '@mexit/shared'

import { useViewFilterStore } from './todo/useTodoFilters'
import { useSearch } from './useSearch'
import { useViewFilters } from './useViewFilters'

const useViewResults = () => {
  const [results, setResults] = useState<SearchResult[]>([])

  const { queryIndex } = useSearch()
  const { generateQuery, getGroupingOptions } = useViewFilters()

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

    const groupBy = groupingOptions.find((option) => option.id === groupedBy)?.id ?? newGroupByKey
    onGroupByChange(groupBy)

    return groupItems(results, { groupBy, sortBy, sortOrder })
  }, [groupedBy, sortBy, sortOrder, results])

  useEffect(() => {
    const query = generateQuery(currentFilters, entities)

    queryIndex('node', query).then((queryResult) => {
      if (queryResult) {
        setResults(queryResult)
      }
    })
  }, [currentFilters, entities])

  return groupedResults
}

export default useViewResults
