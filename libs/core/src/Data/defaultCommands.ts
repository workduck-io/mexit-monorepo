import { CategoryType } from '../Types/Editor'

export const defaultCommands = [
  { command: 'table', text: 'Insert Table', icon: 'ri:table-line', type: CategoryType.action },
  // { command: 'canvas', text: 'Insert Drawing canvas', icon: 'ri:markup-line', type: CategoryType.action },
  { command: 'webem', text: 'Insert Web embed', icon: 'ri:global-line', type: CategoryType.action },
  { command: 'remind', text: 'Create a Reminder', icon: 'ri:timer-line', type: CategoryType.action, extended: true }
]
