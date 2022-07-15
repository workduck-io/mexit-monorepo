export interface CacheUser {
  userID: string
  email: string
  alias: string
  name: string
}

export interface UserCacheState {
  cache: CacheUser[]
  setCache: (users: CacheUser[]) => void
  addUser: (user: CacheUser) => void
  getUser: (find: { email: string } | { userID: string }) => CacheUser | undefined
  clearCache: () => void
}

export const userCacheStoreConstructor = (set, get) => ({
  cache: [],
  setCache: (users: CacheUser[]) => {
    set({ cache: users })
  },
  addUser: (user: CacheUser) => {
    const cache = get().cache
    const isUserAbsent = cache.find((u) => u.userID === user.userID) === undefined
    if (isUserAbsent) set({ cache: [...get().cache, user] })
  },
  getUser: (find: { email?: string; userID?: string }): CacheUser | undefined => {
    const cache = get().cache
    if (find.email !== undefined) {
      return cache.find((u) => u.email === find.email)
    }
    if (find.userID !== undefined) {
      return cache.find((u) => u.userID === find.userID)
    }
    return undefined
  },
  clearCache: () => {
    set({ cache: [] })
  }
})
