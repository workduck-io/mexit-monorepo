import { get, set, del } from 'idb-keyval'

const IDBStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (typeof indexedDB === 'undefined') {
      return null
    }

    return (await get(name)) || null
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (typeof indexedDB === 'undefined') {
      return null
    }
    set(name, value)
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name)
  }
}

export { IDBStorage }
