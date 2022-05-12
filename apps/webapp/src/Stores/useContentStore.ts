import { contentStoreConstructor, ContentStoreState, NodeContent, NodeEditorContent, NodeMetadata } from '@mexit/core'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import IDBStorage from '../Utils/idbStorageAdapter'

const useContentStore = create<ContentStoreState>(
  persist(contentStoreConstructor, { name: 'mexit-content-store', getStorage: () => IDBStorage })
)

export default useContentStore
