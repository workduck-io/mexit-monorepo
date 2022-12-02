import create from 'zustand'
import { persist } from 'zustand/middleware'

import { IDBStorage, reminderStoreConstructor,ReminderStoreState } from '@mexit/core'

export const useReminderStore = create<ReminderStoreState>(
  persist(reminderStoreConstructor, { name: 'mexit-reminder-store', getStorage: () => IDBStorage })
)
