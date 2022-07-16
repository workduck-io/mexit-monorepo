export interface CacheStore {
  // Store urls for gravatar which are not found
  gravatarAbsent: string[]
  addGravatarAbsent: (value: string) => void
}

export const requestCacheConstructor = (set, get) => ({
  gravatarAbsent: [],
  addGravatarAbsent: (value: string) => {
    if (!get().gravatarAbsent.includes(value)) {
      set({
        gravatarAbsent: [...get().gravatarAbsent, value]
      })
    }
  }
})
