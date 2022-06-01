import { contentStoreConstructor, ContentStoreState, IDBStorage } from '@mexit/core'
import create from 'zustand'
import { persist } from 'zustand/middleware'

const useContentStore = create<ContentStoreState>(
  persist(contentStoreConstructor, { name: 'mexit-content-store', getStorage: () => IDBStorage })
)

export { useContentStore }
