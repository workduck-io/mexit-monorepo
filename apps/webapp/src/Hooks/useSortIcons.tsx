import { MIcon, SortOrder, SortType } from '@mexit/core'

export const getSortOrderIcon = (order: SortOrder): MIcon => {
  // mog('getTagFilterValueIcon', { join })
  switch (order) {
    case 'ascending':
      return { type: 'ICON', value: 'ri:sort-asc' }
    case 'descending':
      return { type: 'ICON', value: 'ri:sort-desc' }

    default:
      return { type: 'ICON', value: 'ri:sort-asc' }
  }
}

export const getSortTypeIcon = (type: SortType): MIcon => {
  switch (type) {
    case 'status':
      return { type: 'ICON', value: 'mex:task-progress' }
    case 'priority':
      return { type: 'ICON', value: 'ph:cell-signal-medium-fill' }
    case 'updated':
      return { type: 'ICON', value: 'ri:refresh-line' }
    case 'created':
      return { type: 'ICON', value: 'ri:add-circle-line' }

    default:
      return { type: 'ICON', value: 'ri:ri:functions' }
  }
}
