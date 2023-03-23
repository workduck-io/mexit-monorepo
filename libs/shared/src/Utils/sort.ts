import { get } from 'lodash'

import { SEPARATOR, TodoRanks, TodoStatusRanks } from '@mexit/core'

export const getSortFunction = (sortBy: string) => (a, b) => {
  switch (sortBy) {
    case 'status': {
      if (TodoStatusRanks[a] < TodoStatusRanks[b]) return 1
      else return -1
    }
    case 'priority': {
      if (TodoRanks[a] < TodoRanks[b]) return 1
      else return -1
    }

    case 'created':
    case 'updated':
    default:
      return a > b ? -1 : 1
  }
}

export const sortGroup = <T extends object>(
  a: T,
  b: T,
  options: {
    sortBy: string
    sortOrder?: 'ascending' | 'descending'
  }
) => {
  const sortBy = options.sortBy.split(SEPARATOR).at(-1)

  const aValue = get(a, options.sortBy)
  const bValue = get(b, options.sortBy)

  const val = getSortFunction(sortBy)(aValue, bValue)

  return options.sortOrder === 'ascending' ? val * -1 : val
}
