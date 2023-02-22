import create, { StoreApi, UseBoundStore } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { asyncLocalStorage } from './chromeStorageAdapter'
import { IDBStorage } from './idbStorageAdapter'
import { isExtension } from './isExtension'

export interface TypeMap<T> {
  true: T & {
    _hasHydrated: boolean
    setHasHydrated: (state) => void
  }
  false: T
}

export type SetterFunction<T> = (set: any, get: any) => T

export const createX = <T extends object, R extends keyof TypeMap<T>>(
  config: SetterFunction<T>,
  name: string,
  isPersist: R
): UseBoundStore<TypeMap<T>[R], StoreApi<TypeMap<T>[R]>> => {
  if (isPersist === 'true') {
    const configX = (set, get): TypeMap<T>['true'] => {
      return {
        _hasHydrated: false,
        setHasHydrated: (state) => {
          set({
            _hasHydrated: state
          })
        },
        ...config(set, get)
      }
    }

    return create<TypeMap<T>[R]>(
      devtools(
        persist(configX, {
          name: `mexit-${name}-${isExtension() ? 'extension' : 'webapp'}`,
          getStorage: () => {
            return isExtension() ? asyncLocalStorage : IDBStorage
          },
          onRehydrateStorage: () => (state) => {
            state.setHasHydrated(true)
          }
        }),
        {
          name
        }
      )
    )
  } else {
    //@ts-ignore
    return create<TypeMap<T>['false']>(
      devtools(config, {
        name
      })
    )
  }
}
