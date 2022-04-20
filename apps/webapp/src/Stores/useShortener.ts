import { LinkCaptureStore, shortenerStoreConstructor } from '@mexit/core'
import create from 'zustand'
import { persist } from 'zustand/middleware'

export const useShortenerStore = create<LinkCaptureStore>(
  persist(shortenerStoreConstructor, { name: 'mexit-link-captures' })
)
