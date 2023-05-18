import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

export interface CacheStore {
  // Store urls for gravatar which are not found
  gravatarAbsent: string[]
  addGravatarAbsent: (value: string) => void
}

const requestCacheConfig = (set, get) => ({
  gravatarAbsent: [],
  addGravatarAbsent: (value: string) => {
    if (!get().gravatarAbsent.includes(value)) {
      set({
        gravatarAbsent: [...get().gravatarAbsent, value]
      })
    }
  }
})

export const useRequestCacheStore = createStore(requestCacheConfig, StoreIdentifier.REQUESTCACHE, false)
