import create from 'zustand'

import { IDBStorage, ReminderStoreState, reminderStoreConstructor } from '@mexit/core'
import { persist } from 'zustand/middleware'

export const useReminderStore = create<ReminderStoreState>(
  persist(reminderStoreConstructor, { name: 'mexit-reminder-store', getStorage: () => IDBStorage })
)
