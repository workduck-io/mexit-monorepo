// @ts-nocheck

import * as Store from '../Stores'

const getBackupStores = (excludeStores: Array<string> = ['useLayoutStore', 'useAppStore', 'useAuthStore']) => {
  const stores = []

  Object.entries(Store).forEach(([key, store]) => {
    if (!excludeStores.includes(key) && typeof store === 'function' && store?.getState && store?.getState()?.backup) {
      stores.push(store)
    }
  })

  return stores
}

export const useStore = () => {
  const backup = async () => {
    await Promise.allSettled(getBackupStores().map((utilFunc) => utilFunc?.getState()?.backup()))
  }

  const restore = async (): Promise<boolean> => {
    const result = await Promise.allSettled(
      getBackupStores().map((utilFunc) => utilFunc?.getState()?.initializeFromBackup())
    )

    for (const res of result) {
      if (res.status === 'fulfilled') {
        return res.value
      }
    }

    return false
  }

  return {
    backup,
    restore
  }
}
