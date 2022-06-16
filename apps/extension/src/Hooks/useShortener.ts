import { LinkCaptureStore, shortenerStoreConstructor } from '@mexit/core'
import create, { State } from 'zustand'
import { persist } from 'zustand/middleware'
import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'

export const useShortenerStore = create<LinkCaptureStore>(
  persist(shortenerStoreConstructor, { name: 'mexit-link-captures', getStorage: () => asyncLocalStorage })
)
