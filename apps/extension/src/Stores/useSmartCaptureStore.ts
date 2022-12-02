import create from 'zustand'
import { devtools } from 'zustand/middleware'

import { SmartCaptureStore, smartCaptureStoreConstructor } from '@mexit/core'

export const useSmartCaptureStore = create<SmartCaptureStore>(
  devtools(smartCaptureStoreConstructor, { name: 'mexit-smart-capture-store' })
)
