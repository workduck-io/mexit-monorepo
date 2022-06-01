import { contentStoreConstructor, ContentStoreState, IDBStorage, storageAdapter } from '@mexit/core'
import create from 'zustand'
import { persist } from 'zustand/middleware'

const useContentStore = create<ContentStoreState>(
  persist(contentStoreConstructor, { name: 'mexit-content-store', ...storageAdapter })
)

export { useContentStore }
