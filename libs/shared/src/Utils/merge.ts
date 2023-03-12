import merge from 'deepmerge'
import { get } from 'lodash'

import { UserAccessTable } from '@mexit/core'

export const mergeAccess = (access: UserAccessTable, access2: Partial<UserAccessTable>): UserAccessTable => {
  return merge(access, access2)
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
