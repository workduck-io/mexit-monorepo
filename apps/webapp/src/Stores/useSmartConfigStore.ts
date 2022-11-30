import create from 'zustand'
import { persist } from 'zustand/middleware'

import { IDBStorage, SmartCaptureStore, smartCaptureStoreConstructor } from '@mexit/core'

export const useSmartConfigStore = create<SmartCaptureStore>(
  persist(smartCaptureStoreConstructor, {
    name: 'mexit-smart-capture-store',
    getStorage: () => IDBStorage
  })
)
