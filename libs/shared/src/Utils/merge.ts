import merge from 'deepmerge'
import { get } from 'lodash'

import { SearchResult } from '@workduck-io/mex-search'

import { UserAccessTable } from '@mexit/core'

export const mergeAccess = (access: UserAccessTable, access2: Partial<UserAccessTable>): UserAccessTable => {
  return merge(access, access2)
}

export const keysToExcludeInGrouping = ['id', 'createdAt', 'updatedAt', 'tags', 'text']
export const keysToExcludeInSorting = ['id', 'createdBy', 'updatedBy', 'lastEditedBy', 'tags', 'parent']

export const findGroupingKey = (keyFrequencyMap: Record<string, number>) => {
  let max = 0
  let maxFrequenceKey = ''

  for (const key in keyFrequencyMap) {
    if (keyFrequencyMap[key] > max && !keysToExcludeInGrouping.includes(key)) {
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
    const value = get(item, options.groupBy) ?? 'Ungrouped'

    if (!groupedValues[value]) {
      groupedValues[value] = []
    }

    groupedValues[value].push(item)
  })

  if (options.sortBy) {
    Object.keys(groupedValues).forEach((key) => {
      groupedValues[key].sort((a, b) => {
        const aValue = get(a, options.sortBy)
        const bValue = get(b, options.sortBy)

        if (aValue > bValue) {
          return options.sortOrder === 'descending' ? -1 : 1
        } else if (aValue < bValue) {
          return options.sortOrder === 'descending' ? 1 : -1
        } else {
          return 0
        }
      })
    })
  } else {
    Object.keys(groupedValues).forEach((key) => {
      groupedValues[key].sort((a, b) => {
        const aValue = a[options.groupBy]
        const bValue = b[options.groupBy]

        if (aValue > bValue) {
          return options.sortOrder === 'descending' ? -1 : 1
        } else if (aValue < bValue) {
          return options.sortOrder === 'descending' ? 1 : -1
        } else {
          return 0
        }
      })
    })
  }

  return groupedValues
}
