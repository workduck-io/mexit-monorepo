import { PriorityType, TodoType } from '@mexit/core'

export const REMINDER_PREFIX = 'REMINDER_'

type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

interface WeeklyFrequency {
  type: 'weekly'
  week: [
    {
      day: Weekday
      freq: RepeatFrequency | OnceFrequency
    }
  ]
}

interface RepeatFrequency {
  type: 'repeat'
  /*
   * The times at which the event should occur.
   * All times in the array must be of the same day.
   */
  startTime: number
  endTime: number
  interval: number
  skip?: number
}

interface OnceFrequency {
  type: 'once'
  time: number
}

export type ReminderFrequency = OnceFrequency | RepeatFrequency | WeeklyFrequency
// Which action has been taken

export interface ReminderState {
  // Has been armed
  // If notification was not armed and time elapsed,
  // Arm it if it is within the same day
  // Show missed notifications in all notifications
  snooze: boolean
  done: boolean
}

export interface Reminder {
  id: string
  title: string
  description?: string
  nodeid: string

  // If snooze is set, then snooze time is used
  time: number

  // Which action has been taken
  state: ReminderState

  // Notification metadata
  createdAt: number
  updatedAt: number

  // Frequency, if present is used instead of time
  // TODO: Combine with time
  frequency?: ReminderFrequency
  priority?: PriorityType
  todoid?: string
}

export interface DisplayReminder extends Reminder {
  // Toast display props: (Not part of data)
  path?: string // As get path from id is not present in the toast
  todo?: TodoType // Todo to which the reminder belongs (if any)
}

export type ReminderActions =
  | { type: 'snooze'; value: number }
  | { type: 'open' }
  | { type: 'dismiss' }
  | { type: 'delete' }
  | { type: 'todo'; todoAction: 'status'; value: TodoType }
  | { type: 'todo'; todoAction: 'priority'; value: TodoType }
  | { type: 'todo'; todoAction: 'delete' }

export interface ReminderActionIpcData {
  action: ReminderActions
  reminder: Reminder
}

export interface ReminderGroup {
  type: string
  label: string
  reminders: Reminder[]
}

export interface DisplayReminderGroup extends ReminderGroup {
  reminders: DisplayReminder[]
}

export interface NodeReminderGroup {
  type: 'upcoming' | 'past'
  label: string
  reminders: Reminder[]
}
