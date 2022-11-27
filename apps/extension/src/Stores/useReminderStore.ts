import { reminderStoreConstructor,ReminderStoreState } from '@mexit/core'
import create from 'zustand'
import { persist } from 'zustand/middleware'

import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'

export const useReminderStore = create<ReminderStoreState>(
  persist(reminderStoreConstructor, { name: 'mexit-reminder-store', getStorage: () => asyncLocalStorage })
)
