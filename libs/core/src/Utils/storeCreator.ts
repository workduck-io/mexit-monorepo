import create, { StoreApi, UseBoundStore } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { StoreIdentifier } from '../Types/Store'

import { asyncLocalStorage } from './chromeStorageAdapter'
import { IDBStorage } from './idbStorageAdapter'
import { isExtension } from './isExtension'

export type TypeMap<T, R extends boolean> = R extends true
  ? T & {
      _hasHydrated: boolean
      setHasHydrated: (state) => void
    }
  : T

export type SetterFunction<T> = (set: any, get: any) => T

export const createStore = <T extends object, R extends boolean>(
  config: SetterFunction<T>,
  name: StoreIdentifier,
  isPersist: R,
  persistOptions?: {
    version: number
    migrate?: (persistedState: any, version: number) => any
  }
): UseBoundStore<TypeMap<T, R>, StoreApi<TypeMap<T, R>>> => {
  if (isPersist) {
    const configX = (set, get): TypeMap<T, true> => {
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

    return create<TypeMap<T, R>>(
      devtools(
        persist(configX, {
          name: `mexit-${name}-${isExtension() ? 'extension' : 'webapp'}`,
          ...(persistOptions ? persistOptions : {}),
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
    return create<TypeMap<T, false>>(
      devtools(config, {
        name
      })
    )
  }
}
