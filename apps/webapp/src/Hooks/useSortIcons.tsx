import { MIcon, SortOrder } from '@mexit/core'
import { DefaultMIcons } from '@mexit/shared'

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

export const getBlockFieldIcon = (type: string): MIcon => {
  switch (type) {
    case 'status':
      return DefaultMIcons.TASK
    case 'priority':
      return { type: 'ICON', value: 'ph:cell-signal-medium-fill' }
    case 'updatedAt':
      return { type: 'ICON', value: 'ri:refresh-line' }
    case 'createdBy':
    case 'updatedBy':
      return DefaultMIcons.MENTION
    case 'parent':
      return DefaultMIcons.NOTE
    case 'text':
      return DefaultMIcons.TEXT
    case 'createdAt':
      return { type: 'ICON', value: 'ri:add-circle-line' }

    default:
      return DefaultMIcons.ADD
  }
}
