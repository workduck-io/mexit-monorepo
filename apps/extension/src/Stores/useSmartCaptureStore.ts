import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { SmartCaptureStore, smartCaptureStoreConstructor } from '@mexit/core'

import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'

export const useSmartCaptureStore = create<SmartCaptureStore>(
  persist(devtools(smartCaptureStoreConstructor, { name: 'mexit-smart-capture-store' }), {
    name: 'mexit-smart-capture-store',
    getStorage: () => asyncLocalStorage
  })
)
