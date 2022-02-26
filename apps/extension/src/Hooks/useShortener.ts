import { LinkCaptureStore, shortnerStoreConstructor, storageAdapter } from '@mexit/shared'
import create, { State } from 'zustand'
import { persist } from 'zustand/middleware'

export const useShortenerStore = create<LinkCaptureStore>(
  persist(shortnerStoreConstructor, { name: 'mexit-link-captures', ...storageAdapter })
)
