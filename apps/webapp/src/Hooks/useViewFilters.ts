import { ISearchQuery, SimpleQueryType } from '@workduck-io/mex-search'

import { Filter, FilterJoin, FilterType, FilterTypeWithOptions, useMentionStore } from '@mexit/core'

import { useDataStore } from '../Stores/useDataStore'

export const useViewFilters = () => {
  /**
   * Get all filters for Filter Menu that can be applied to the current view
   * @returns Array of filters
   */
  const getFilters = () => {
    const notes = useDataStore.getState().ilinks
    const tags = useDataStore.getState().tags
    const spaces = useDataStore.getState().spaces
    const mentions = useMentionStore.getState().mentionable

    const noteFilter = notes.reduce(
      (prev, noteLink) => {
        prev.options.push({ id: noteLink.nodeid, label: noteLink.path, value: noteLink.path })
        return prev
      },
      { type: 'note', label: 'Notes', options: [] } as FilterTypeWithOptions
    )

    const tagFilter = tags.reduce(
      (prev, tag) => {
        prev.options.push({
          id: `filter_tag_${tag.value}`,
          label: tag.value,
          value: tag.value
        })

        return prev
      },
      {
        type: 'tag',
        label: 'Tags',
        options: []
      } as FilterTypeWithOptions
    )

    const mentionFilter = mentions.reduce(
      (prev, mention) => {
        prev.options.push({
          id: `mention_${mention.id}`,
          label: mention.alias,
          value: mention.id
        })

        return prev
      },
      {
        type: 'mention',
        label: 'Mentions',
        options: []
      } as FilterTypeWithOptions
    )

    const spaceFilter = spaces.reduce(
      (prev, space) => {
        prev.options.push({
          id: `namespace_${space.id}`,
          label: space.name,
          value: space.id
        })

        return prev
      },
      {
        type: 'space',
        label: 'Spaces',
        options: []
      } as FilterTypeWithOptions
    )

    return [noteFilter, tagFilter, mentionFilter, spaceFilter]
  }

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
    return filter.values.map((value) => ({
      type: getQueryType(filter.type),
      value: value.id,
      nextOperator: getJoinType(filter.join)
    }))
  }

  /**
   * Get filtered result for the current view
   */
  const generateQuery = (filters: Array<Filter>, entities: Array<Entities>): ISearchQuery => {
    const query = filters.reduce((prev, filter) => {
      return [...prev, ...transformQuery(filter)]
    }, [])

    return [
      {
        type: 'query',
        query,
        ...(entities?.length ? { entities } : {})
      }
    ]
  }

  return { getFilters, generateQuery }
}
