import { LinkCaptureStore, shortenerStoreConstructor } from '@mexit/core'
import create, { State } from 'zustand'
import { persist } from 'zustand/middleware'
import { storageAdapter } from '@mexit/core'

export const useShortenerStore = create<LinkCaptureStore>(
  persist(shortenerStoreConstructor, { name: 'mexit-link-captures', ...storageAdapter })
)
