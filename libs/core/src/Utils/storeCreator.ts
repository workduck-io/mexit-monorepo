import { create,StoreApi, UseBoundStore } from 'zustand'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'

import { getStoreName,StoreIdentifier } from '../Types/Store'

import { asyncLocalStorage } from './chromeStorageAdapter'
import { IDBStorage } from './idbStorageAdapter'
import { isExtension } from './isExtension'
import { BackupStorage } from './storage'

type TypeMap<T, R extends boolean> = R extends true
  ? T & {
      _hasHydrated: boolean
      setHasHydrated: (state) => void
      initializeFromBackup: (workspaceId: string) => Promise<boolean>
      backup: (workspaceId: string) => Promise<void>
    }
  : T

type SetterFunction<T> = (set: any, get: any) => T

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
): UseBoundStore<StoreApi<TypeMap<T, R>>> => {
  if (isPersist) {
    const storeName = getStoreName(name, isExtension())

    const configX = (set, get): TypeMap<T, true> => {
      return {
        _hasHydrated: false,
        setHasHydrated: (state) => {
          set({
            _hasHydrated: state
          })
        },
        backup: async (workspaceId) => {
          // TODO: Backup to storage
          if (workspaceId && !isExtension()) {
            const storeToBackup = get()
            BackupStorage.putValue(workspaceId, storeName, JSON.stringify(storeToBackup))
          }
        },
        initializeFromBackup: async (workspaceId) => {
          if (workspaceId && !isExtension()) {
            const storedBackup = await BackupStorage.getValue(workspaceId, storeName)
            if (storedBackup) {
              const back = JSON.parse(storedBackup)
              set(back)
              return true
            }
          }

          return false
        },
        ...config(set, get)
      }
    }

    const { storage, ...storeOptions } = persistOptions || {}

    const getStorage = () => {
      const webStorage = storage?.web ?? IDBStorage
      const extensionStorage = storage?.extension ?? asyncLocalStorage
      return isExtension() ? extensionStorage : webStorage
    }
    return create<TypeMap<T, R>>()(
      devtools(
        persist(configX, {
          name: storeName,
          ...storeOptions,
          getStorage,
          onRehydrateStorage: (state) => {
            return (state, error) => {
              if (error) {
                console.error('an error happened during hydration', error)
              }
            }
          }
        }),
        {
          name: `mex-${name}-persist`
        }
      )
    )
  } else {
    //@ts-ignore
    return create()<TypeMap<T, false>>(
      subscribeWithSelector(() =>
        devtools(config, {
          name: `mex-${name}-nopersist`
        })
      )
    )
  }
}
