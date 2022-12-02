import create from 'zustand'

import { CacheStore, requestCacheConstructor } from '@mexit/core'

export const useCacheStore = create<CacheStore>(requestCacheConstructor)
