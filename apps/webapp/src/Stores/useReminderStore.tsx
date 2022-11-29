import { IDBStorage, reminderStoreConstructor,ReminderStoreState } from '@mexit/core'
import create from 'zustand'
import { persist } from 'zustand/middleware'

export const useReminderStore = create<ReminderStoreState>(
  persist(reminderStoreConstructor, { name: 'mexit-reminder-store', getStorage: () => IDBStorage })
)
