import merge from 'deepmerge'
import { get } from 'lodash'

import { SearchResult } from '@workduck-io/mex-search'

import { getSuperBlockFields, SEPARATOR, UserAccessTable } from '@mexit/core'

import { getSortFunction, sortGroup } from './sort'

export const mergeAccess = (access: UserAccessTable, access2: Partial<UserAccessTable>): UserAccessTable => {
  return merge(access, access2)
}

export const keysToExcludeInGrouping = [
  'id',
  'createdAt',
  'caption',
  'url',
  'updatedAt',
  'title',
  'active',
  'entity',
  'value',
  'lastEditedBy',
  'tags',
  'text',
  'type'
]
export const keysToExcludeInSorting = [
  'id',
  'createdBy',
  'url',
  'caption',
  'updatedBy',
  'lastEditedBy',
  'title',
  'active',
  'entity',
  'value',
  'tags',
  'parent',
  'type'
]

export const findGroupingKey = (keyFrequencyMap: Record<string, number>, keysToExclude?: Array<string>) => {
  let max = 0
  let maxFrequenceKey = ''

  for (const key in keyFrequencyMap) {
    const keyToCheck = key.split(SEPARATOR).at(-1)
    if (keyFrequencyMap[key] > max && !keysToExclude?.includes(keyToCheck)) {
      max = keyFrequencyMap[key]
      maxFrequenceKey = key
    }
  }

  return maxFrequenceKey
}

type KeyFrequencyMapType = Record<string, number>

export const getKeyFrequencyMap = (data: Record<string, any>[]): KeyFrequencyMapType => {
  const keyFrequencyMap: KeyFrequencyMapType = {}
  const iterateObject = (obj: Record<string, any>, keyPrefix = '') => {
    Object.keys(obj).forEach((objKey) => {
      const key = keyPrefix ? `${keyPrefix}.${objKey}` : objKey
      const value = obj[objKey]

      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (typeof item === 'object') {
            iterateObject(item, key)
          }
        })
      } else if (typeof value === 'object') {
        iterateObject(value, key)
      } else {
        if (keyFrequencyMap[key]) {
          keyFrequencyMap[key]++
        } else {
          keyFrequencyMap[key] = 1
        }
      }
    })
  }

  data.forEach((obj) => {
    iterateObject(obj)
  })

  return keyFrequencyMap
}

export const groupItems = (
  items: any[],
  options: {
    groupBy: string
    sortBy?: string
    sortOrder?: 'ascending' | 'descending'
  }
): Record<string, SearchResult[]> => {
  const groupedValues = {}

  items.forEach((item) => {
    const superBlock = getSuperBlockFields(item)
    const value = get(superBlock, options.groupBy) ?? 'Ungrouped'

    if (!groupedValues[value]) {
      groupedValues[value] = []
    }

    groupedValues[value].push(item)
  })

  const sortBy = options.sortBy ?? options.groupBy

  if (sortBy) {
    Object.keys(groupedValues).forEach((key) => {
      groupedValues[key] = groupedValues[key].sort((a, b) => sortGroup(a, b, { sortBy, sortOrder: options.sortOrder }))
    })
  }

  return Object.keys(groupedValues)
    .sort((a, b) => {
      if (a === 'Ungrouped') return 1
      if (b === 'Ungrouped') return -1

      const sort = options.groupBy.split(SEPARATOR).at(-1)
      const val = getSortFunction(sort)(a, b)

      return val
    })
    .reduce((acc, key) => {
      acc[key] = groupedValues[key]
      return acc
    }, {})
}
