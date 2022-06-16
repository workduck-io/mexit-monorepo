import create from 'zustand'

import { IDBStorage, mog, Reminder, ReminderState } from '@mexit/core'
import { persist } from 'zustand/middleware'

interface ArmedReminder {
  reminderId: string
  timeoutId: NodeJS.Timeout
}

interface ReminderStoreState {
  reminders: Reminder[]
  setReminders: (reminders: Reminder[]) => void
  addReminder(reminder: Reminder): void
  deleteReminder(id: string): void
  updateReminder(newReminder: Reminder): void
  updateReminderState: (id: string, rstate: ReminderState) => void
  clearReminders(): void
  getNodeReminderGroup(): Record<string, Reminder[]>

  // To store the currently aremd ie:"timeout set" reminders
  armedReminders: Array<ArmedReminder>
  setArmedReminders: (reminders: ArmedReminder[]) => void
  addArmReminder: (reminder: ArmedReminder) => void
  clearArmedReminders: () => void
  snoozeReminder: (id: string, time: number) => void

  modalOpen: boolean
  setModalOpen: (modalOpen: boolean) => void
}

export const useReminderStore = create<ReminderStoreState>(
  persist(
    (set, get) => ({
      reminders: [],
      setReminders: (reminders: Reminder[]) => set({ reminders }),
      addReminder: (reminder: Reminder) => set((state) => ({ reminders: [...state.reminders, reminder] })),
      deleteReminder: (id: string) =>
        set((state) => ({
          reminders: state.reminders.filter((reminder) => reminder.id !== id)
        })),
      updateReminder: (newReminder: Reminder) =>
        set((state) => ({
          reminders: state.reminders.map((reminder) =>
            reminder.id === newReminder.id ? { ...reminder, ...newReminder } : reminder
          )
        })),
      updateReminderState: (id: string, rstate: ReminderState) => {
        mog('ReminderArmer: updateReminderState', { id, rstate })
        get().updateReminder({ ...get().reminders.find((reminder) => reminder.id === id), state: rstate })
      },

      clearReminders: () => set({ reminders: [] }),

      snoozeReminder: (id: string, time: number) => {
        const oldRem = get().reminders.find((reminder) => reminder.id === id)
        const newRem = { ...oldRem, state: { ...oldRem.state, done: false, snooze: true }, time }
        get().updateReminder(newRem)
      },

      getNodeReminderGroup: () => {
        const reminders = get().reminders.filter((reminder) => reminder.state.done === false)
        const groups: Record<string, Reminder[]> = {}

        reminders.forEach((reminder) => {
          if (!groups[reminder.nodeid]) {
            groups[reminder.nodeid] = [reminder]
          } else {
            groups[reminder.nodeid] = [...groups[reminder.nodeid], reminder]
          }
        })
        return groups
      },

      armedReminders: [],
      setArmedReminders: (reminders: ArmedReminder[]) => set({ armedReminders: reminders }),
      addArmReminder: (reminder: ArmedReminder) =>
        set((state) => ({ armedReminders: [...state.armedReminders, reminder] })),
      clearArmedReminders: () => set({ armedReminders: [] }),

      modalOpen: false,
      setModalOpen: (modalOpen: boolean) => set({ modalOpen })
    }),
    { name: 'mexit-reminder-store', getStorage: () => IDBStorage }
  )
)
