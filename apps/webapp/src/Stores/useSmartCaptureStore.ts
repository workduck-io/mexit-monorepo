import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { IDBStorage, SmartCaptureStore, smartCaptureStoreConstructor } from '@mexit/core'

export const useSmartCaptureStore = create<SmartCaptureStore>(
  persist(devtools(smartCaptureStoreConstructor, { name: 'WEBAPP_SMART_CAPTURE' }), {
    name: 'mexit-smart-capture-store',
    getStorage: () => IDBStorage
  })
)
