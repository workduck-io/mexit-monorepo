import create from 'zustand'

import { ReminderStoreState, reminderStoreConstructor } from '@mexit/core'
import { persist } from 'zustand/middleware'
import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'

export const useReminderStore = create<ReminderStoreState>(
  persist(reminderStoreConstructor, { name: 'mexit-reminder-store', getStorage: () => asyncLocalStorage })
)
