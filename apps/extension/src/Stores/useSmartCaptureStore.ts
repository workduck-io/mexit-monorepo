import create from 'zustand'
import { persist } from 'zustand/middleware'

import { SmartCaptureStore, smartCaptureStoreConstructor } from '@mexit/core'

import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'

export const useSmartCaptureStore = create<SmartCaptureStore>(
  persist(smartCaptureStoreConstructor, {
    name: 'mexit-smart-capture-store',
    getStorage: () => asyncLocalStorage
  })
)
