import * as Store from '../Stores'
import { getStoreName, StoreIdentifier } from '../Types'
import { BackupStorage, getLocalStorage, isExtension, mog } from '../Utils'

const getBackupStores = (excludeStores: Array<string> = ['useLayoutStore', 'useAppStore', 'useAuthStore']) => {
  const stores = []

  Object.entries(Store).forEach(([key, store]) => {
    //@ts-ignore
    if (!excludeStores.includes(key) && typeof store === 'function' && store?.getState && store?.getState()?.backup) {
      stores.push(store)
    }
  })

  return stores
}

const getWorkspaceIdFromStorage = () => {
  const storeName = getStoreName(StoreIdentifier.AUTH, isExtension())
  const authStorage = getLocalStorage().getItem(storeName)

  if (authStorage) {
    const workspace = JSON.parse(authStorage)?.state?.workspaceDetails
    return workspace?.id
  }
}

export const useStore = () => {
  const backup = async () => {
    const workspaceId = getWorkspaceIdFromStorage()
    await Promise.allSettled(getBackupStores().map((utilFunc) => utilFunc?.getState()?.backup(workspaceId)))
    const s3URL = await BackupStorage.backUpToS3(workspaceId)
    mog('Saving Backup', {
      s3URL,
      workspaceId
    })
  }

  const restore = async (): Promise<boolean> => {
    const workspaceId = getWorkspaceIdFromStorage()
    const result = await Promise.allSettled(
      getBackupStores().map((utilFunc) => utilFunc?.getState()?.initializeFromBackup(workspaceId))
    )

    for (const res of result) {
      if (res.status === 'fulfilled') {
        return res.value
      }
    }

    return false
  }

  const restoreFromS3 = async (): Promise<string> => {
    const workspaceId = getWorkspaceIdFromStorage()
    const backup = await BackupStorage.fetchFromS3(workspaceId).then((str) => {
      return JSON.parse(str)
    })
    const timestampStore: string = backup.find((item) => item.key === 'mexit-timestamp-webapp')?.value

    await BackupStorage.putBulkValue(workspaceId, backup)
    await restore()

    return JSON.parse(timestampStore)?.timestamp
  }

  return {
    backup,
    restore,
    restoreFromS3
  }
}
