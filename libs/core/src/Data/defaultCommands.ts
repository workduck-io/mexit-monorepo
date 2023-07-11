import { CategoryType, SlashCommand } from '../Types/Editor'
import { getMIcon } from '../Types/Store'

export const defaultCommands: SlashCommand[] = [
  {
    command: 'ai',
    text: 'Start with AI',
    icon: getMIcon('ICON', 'fluent:text-grammar-wand-24-filled'),
    type: CategoryType.action
  },
  { command: 'task', text: 'Create a Task', icon: getMIcon('ICON', 'ri:task-line'), type: CategoryType.action },
  { command: 'table', text: 'Insert Table', icon: getMIcon('ICON', 'ri:table-line'), type: CategoryType.action },
  { command: 'webem', text: 'Insert Web embed', icon: getMIcon('ICON', 'ri:global-line'), type: CategoryType.action }

  // TODO: Add this back in when they are ready
  // {
  //   command: 'remind',
  //   text: 'Create a Reminder',
  //   icon: getMIcon('ICON', 'ri:timer-line'),
  //   type: CategoryType.action,
  //   extended: true
  // }
] as SlashCommand[]
