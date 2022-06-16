import { recentsStoreConstructor, RecentsType } from '@mexit/core'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'

export const useRecentsStore = create<RecentsType>(
  persist(recentsStoreConstructor, { name: 'recents-store', getStorage: () => asyncLocalStorage })
)
