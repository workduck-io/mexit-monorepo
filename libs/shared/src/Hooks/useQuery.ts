import { Entities, ISearchQuery, ISimpleQueryUnit, QueryUnit, SimpleQueryType } from '@workduck-io/mex-search'

import { Filter, FilterJoin, FilterType, SuperBlocks } from '@mexit/core'

export const useQuery = () => {
  const getJoinType = (joinType: FilterJoin) => {
    switch (joinType) {
      case 'all':
        return 'and'
      case 'any':
        return 'or'
      default:
        throw new Error('Invalid Filter Join Type')
    }
  }

  const getQueryType = (type: FilterType): SimpleQueryType => {
    switch (type) {
      case 'note':
      case 'space':
        return 'heirarchy'
      case 'tag':
        return 'tag'
      case 'mention':
        return 'mention'
      default:
        throw new Error('Invalid Filter Type')
    }
  }

  const transformQuery = (filter: Filter) => {
    return filter.values.map((filterValue) => ({
      type: getQueryType(filter.type),
      value: filterValue.value,
      nextOperator: getJoinType(filter.join)
    }))
  }

  const generateFilterQuery = (filters: Array<Filter>): ISearchQuery => {
    if (!filters?.length) return []

    const transformedQueries: ISearchQuery = filters.reduce((prevQueries, filter) => {
      const query = transformQuery(filter)
      return query?.length ? [...prevQueries, ...query] : prevQueries
    }, [])

    return transformedQueries
  }

  const generateFilterSetQuery = (filterSets: Array<Array<Filter>>, entities: Array<SuperBlocks>): any => {
    const querySets = filterSets.reduce((prev, filters, currentIndex) => {
      const queryArray: ISearchQuery = []

      if (filters !== undefined && filters.length > 0) {
        const filterQuery = generateFilterQuery(filters)
        queryArray.push(...filterQuery)

        const searchQuery: QueryUnit = { type: 'query', query: queryArray }

        if (entities?.length > 0 && currentIndex === filterSets.length - 1) {
          searchQuery.entities = entities
        }

        return [...prev, searchQuery]
      }

      return prev
    }, [] as ISearchQuery)

    return querySets
  }

  const generateSearchQuery = (text: string, filters?: Array<Filter>, entities?: Array<Entities>): ISearchQuery => {
    const queryArray: ISearchQuery = []

    if (text?.length) {
      const textQuery = { type: 'text', value: text } as ISimpleQueryUnit
      queryArray.push(textQuery)
    }

    if (filters !== undefined && filters.length > 0) {
      const filterQuery = generateFilterQuery(filters)
      queryArray.push(...filterQuery)
    }

    const searchQuery: QueryUnit = { type: 'query', query: queryArray }

    if (entities !== undefined && entities.length > 0) {
      searchQuery.entities = entities
    }

    return [searchQuery]
  }

  return {
    generateFilterQuery,
    generateSearchQuery,
    generateFilterSetQuery
  }
}
