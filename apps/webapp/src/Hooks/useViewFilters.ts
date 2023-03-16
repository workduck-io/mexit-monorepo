import { SearchResult } from '@workduck-io/mex-search'

import { FilterTypeWithOptions, SEPARATOR, useDataStore, useMentionStore } from '@mexit/core'
import { findGroupingKey, getKeyFrequencyMap, keysToExcludeInGrouping, SearchEntityType } from '@mexit/shared'

import { getBlockFieldIcon } from './useSortIcons'

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
        prev.options.push({ id: noteLink.nodeid, label: noteLink.path, value: noteLink.nodeid })
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

  const getGroupingOptions = (
    items: Array<SearchResult>,
    labelsToReplace: Record<string, string> = {}
  ): { options: Array<SearchEntityType>; groupBy: string } => {
    const keyFrequencyMap = getKeyFrequencyMap(items)
    const groupBy = findGroupingKey(keyFrequencyMap, keysToExcludeInGrouping)

    if (!groupBy) {
      return { options: [], groupBy: undefined }
    }

    const options = Object.keys(keyFrequencyMap)

      .map((key) => {
        const keyToCheck = key.split(SEPARATOR).at(-1)
        return {
          id: key,
          label: labelsToReplace[key] || keyToCheck,
          icon: getBlockFieldIcon(keyToCheck)
        }
      })
      .sort((a, b) => (a.label > b.label ? 1 : -1))
    return {
      options,
      groupBy
    }
  }

  const getGroupBy = (items: Array<SearchResult>) => {
    const keyFrequencyMap = getKeyFrequencyMap(items)
    const groupBy = findGroupingKey(keyFrequencyMap)

    return groupBy
  }

  return { getFilters, getGroupBy, getGroupingOptions }
}
