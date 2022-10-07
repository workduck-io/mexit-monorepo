// import { MexNodeIcons } from 'src/components/icons/Icons'
import { isElder, BASE_DRAFT_PATH, BASE_TASKS_PATH } from '@mexit/core'

export const getNodeIcon = (path: string) => {
  if (isElder(path, BASE_DRAFT_PATH) || path === BASE_DRAFT_PATH) {
    return 'ri:draft-line'
  }
  if (isElder(path, BASE_TASKS_PATH) || path === BASE_TASKS_PATH) {
    return 'ri:task-line'
  }
}

export const DefaultNodeIcon = 'ri:file-list-2-line'

export const FilterTypeIcons = {
  note: 'ri:file-list-2-line',
  tag: 'ri:hashtag',
  space: 'heroicons-outline:view-grid',
  mention: 'ri:at-line',
  date: 'ri:calendar-2-line',
  state: 'ri:checkbox-circle-line',
  has: 'ri:checkbox-circle-line',
  domain: 'ri:earth-line'
}
