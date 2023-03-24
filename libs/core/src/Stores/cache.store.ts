import { StoreIdentifier } from '../Types/Store'
import { getLocalStorage } from '../Utils/storage'
import { createStore } from '../Utils/storeCreator'

export interface CacheUser {
  id: string
  email: string
  alias: string
  name: string
}

const getInitialState = () => ({
  cache: [] as CacheUser[]
})

const userCacheStoreConfig = (set, get) => ({
  ...getInitialState(),
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
    const initialState = getInitialState()
    set(initialState)
  }
})

export const useUserCacheStore = createStore(userCacheStoreConfig, StoreIdentifier.USERCACHE, true, {
  storage: {
    web: getLocalStorage()
  }
})
