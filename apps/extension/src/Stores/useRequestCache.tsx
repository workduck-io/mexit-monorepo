import { CacheStore, requestCacheConstructor } from '@mexit/core'
import create from 'zustand'

export const useCacheStore = create<CacheStore>(requestCacheConstructor)
