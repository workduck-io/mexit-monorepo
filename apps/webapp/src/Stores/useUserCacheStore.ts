import create from 'zustand'
import { persist } from 'zustand/middleware'

interface CacheUser {
  userID: string
  email: string
  alias: string
  name: string
}

interface UserCacheState {
  cache: CacheUser[]

  addUser: (user: CacheUser) => void
  getUser: (find: { email: string } | { userID: string }) => CacheUser | undefined
  clearCache: () => void
}

export const useUserCacheStore = create<UserCacheState>(
  persist(
    (set, get) => ({
      cache: [],

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
    }),
    {
      name: 'mexit-user-cache'
    }
  )
)