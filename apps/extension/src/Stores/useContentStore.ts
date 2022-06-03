import create, { State } from 'zustand'
import { persist } from 'zustand/middleware'
import { contentStoreConstructor, ContentStoreState, storageAdapter } from '@mexit/core'

export const useContentStore = create<ContentStoreState>(
  persist(contentStoreConstructor, {
    name: 'mexit-content-store',
    ...storageAdapter
  })
)
