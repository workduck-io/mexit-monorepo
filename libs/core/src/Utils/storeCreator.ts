import create, { StoreApi, UseBoundStore } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { getStoreName, StoreIdentifier } from '../Types/Store'

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

export type StorageType = {
  web: Storage
  extension: Storage
}

export const createStore = <T extends object, R extends boolean>(
  config: SetterFunction<T>,
  name: StoreIdentifier,
  isPersist: R,
  persistOptions?: {
    version?: number
    storage?: Partial<StorageType>
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

    const { storage, ...storeOptions } = persistOptions || {}

    return create<TypeMap<T, R>>(
      devtools(
        persist(configX, {
          name: getStoreName(name, isExtension()),
          ...storeOptions,
          getStorage: () => {
            const webStorage = storage?.web ?? IDBStorage
            const extensionStorage = storage?.extension ?? asyncLocalStorage

            return isExtension() ? extensionStorage : webStorage
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
