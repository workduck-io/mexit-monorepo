import merge from 'deepmerge'
import { get } from 'lodash'

import { mog, UserAccessTable } from '@mexit/core'

export const mergeAccess = (access: UserAccessTable, access2: Partial<UserAccessTable>): UserAccessTable => {
  return merge(access, access2)
}

export const keysToExcludeInGrouping = [
  'id',
  'createdAt',
  'updatedAt',
  'createdBy',
  'updatedBy',
  'lastEditedBy',
  'tags',
  'text'
]

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

  mog('KEY FREQUENCY', { keyFrequencyMap })
  return keyFrequencyMap
}

export const groupByKey = (items: any[], key: string) => {
  const groupedValues = {}

  items.forEach((item) => {
    const value = get(item, key) ?? 'Ungrouped'

    if (!groupedValues[value]) {
      groupedValues[value] = []
    }

    groupedValues[value].push(item)
  })

  return groupedValues
}
