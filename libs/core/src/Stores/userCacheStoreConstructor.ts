export interface CacheUser {
  id: string
  email: string
  alias: string
  name: string
}

export interface UserCacheState {
  cache: CacheUser[]
  setCache: (users: CacheUser[]) => void
  addUser: (user: CacheUser) => void
  getUser: (find: { email: string } | { id: string }) => CacheUser | undefined
  clearCache: () => void
}

export const userCacheStoreConstructor = (set, get) => ({
  cache: [],
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
