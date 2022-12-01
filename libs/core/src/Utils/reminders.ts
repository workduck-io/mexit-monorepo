import { KanbanBoard, KanbanCard, KanbanColumn } from '../Types/Kanban'
import { Reminder } from '../Types/Reminders'
import { startOfTomorrow, sub } from 'date-fns'

export interface ReminderControl {
  type: 'dismiss' | 'open' | 'delete' | 'unarchive'
  action: (reminder: Reminder) => void
}

export interface SnoozeControl {
  type: 'snooze'
  action: (reminder: Reminder, time: number) => void
}

export type ReminderControls = Array<ReminderControl | SnoozeControl>

export interface ReminderBoardCard extends KanbanCard {
  reminder: Reminder
}

export interface ReminderBoardColumn extends KanbanColumn {
  id: string
  cards: ReminderBoardCard[]
}

export interface ReminderBoard extends KanbanBoard {
  columns: ReminderBoardColumn[]
}

/*
 * Only sets up reminder for the next 24 hours
 */
const BASE_REMINDER_HEIGHT = 80
const BASE_TITLE_HEIGHT = 20
export const BASE_WIDTH = 500
const BASE_PADDING = 12

export const REMINDERS_DIMENSIONS = {
  height: 100,
  width: BASE_WIDTH + BASE_PADDING * 2,
  baseWidth: BASE_WIDTH,
  padding: BASE_PADDING,
  offset: 20
}

export type ReminderStatus = 'active' | 'snooze' | 'seen' | 'missed'

export const getReminderState = (reminder: Reminder): ReminderStatus => {
  const now = new Date()
  const lessOneMin = sub(now, { minutes: 1 })
  const { time, state } = reminder
  if (state.done) {
    return 'seen'
  }
  if (time < lessOneMin.getTime()) {
    return 'missed'
  }
  if (state.snooze) {
    return 'snooze'
  }
  return 'active'
}

export const past = (reminder: Reminder) => {
  const today = new Date()
  const reminderDate = new Date(reminder.time)
  return today.getTime() > reminderDate.getTime()
}

export const today = (reminder: Reminder) => {
  const now = new Date()
  const tomorrow = startOfTomorrow()
  return now.getTime() <= reminder.time && tomorrow.getTime() >= reminder.time
}

export const upcoming = (reminder: Reminder) => {
  const todayExact = new Date()
  const today = sub(todayExact, { minutes: 1 })
  return today.getTime() <= reminder.time
}

export const ReminderViewData: any = {
  id: 'reminders',
  title: '',
  filters: [],
  globalJoin: 'all'
}
