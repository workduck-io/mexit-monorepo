import { LinkCaptureStore, shortnerStoreConstructor } from '@mexit/shared'
import create from 'zustand'
import { persist } from 'zustand/middleware'

export const useShortenerStore = create<LinkCaptureStore>(
  persist(shortnerStoreConstructor, { name: 'mexit-link-captures' })
)
