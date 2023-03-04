import { StoreIdentifier } from "../Types/Store"
import { createStore } from "../Utils/storeCreator"

export interface CacheUser {
  id: string
  email: string
  alias: string
  name: string
}

const userCacheStoreConfig = (set, get) => ({
  cache: [] as CacheUser[],
  setCache: (users: CacheUser[]) => {
    set({ cache: users })
  },
  addUser: (user: CacheUser) => {
    set({ cache: [...get().cache, user] })
  },
  getUser: (find: { email?: string; id?: string }): CacheUser | undefined => {
    const cache = get().cache
    if (find.email !== undefined) {
      return cache.find((u) => u.email === find.email)
    }
    if (find.id !== undefined) {
      return cache.find((u) => u.id === find.id)
    }
    return undefined
  },
  clearCache: () => {
    set({ cache: [] })
  }
})

export const useUserCacheStore = createStore(userCacheStoreConfig, StoreIdentifier.USERCACHE , true)