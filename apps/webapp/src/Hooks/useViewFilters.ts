import { SearchResult } from '@workduck-io/mex-search'

import { FilterTypeWithOptions, useMentionStore } from '@mexit/core'

import { useDataStore } from '../Stores/useDataStore'

import { useViewFilterStore } from './todo/useTodoFilters'

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
          id: `filter_tag_${tag}`,
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

  /**
   * Get filtered result for the current view
   */
  const getFilteredResults = (items: SearchResult[]) => {
    const appliedFilters = useViewFilterStore.getState().currentFilters

    // * TODO: Return filtered Result
    return items
  }

  return { getFilters }
}
