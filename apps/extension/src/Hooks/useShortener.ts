import { LinkCaptureStore, shortenerStoreConstructor, storageAdapter } from '@mexit/shared'
import create, { State } from 'zustand'
import { persist } from 'zustand/middleware'

export const useShortenerStore = create<LinkCaptureStore>(
  persist(shortenerStoreConstructor, { name: 'mexit-link-captures', ...storageAdapter })
)
