import { SmartCaptureStore, smartCaptureStoreConstructor } from '@mexit/core'
import create from 'zustand'
import { devtools } from 'zustand/middleware'

export const useSmartCaptureStore = create<SmartCaptureStore>(
  devtools(smartCaptureStoreConstructor, { name: 'mexit-smart-capture-store' })
)
