import { get } from 'idb-keyval'

import { BroadcastSyncedChannel, getStoreName, StoreIdentifier } from '@mexit/core'

const updateDwindleAuth = (extension) => {
  const authAWS = JSON.parse(localStorage.getItem('auth-aws')).state
  extension.sendToExtension({
    msgId: BroadcastSyncedChannel.DWINDLE,
    state: authAWS,
    updatedAt: +new Date(),
    fromLocal: true
  })
}

const updateUserInfo = async (extension) => {
  const storeName = getStoreName(StoreIdentifier.AUTH, false)
  const data = await get(storeName)
  extension.sendToExtension({
    msgId: BroadcastSyncedChannel.AUTH,
    state: JSON.parse(data).state,
    updatedAt: +new Date(),
    fromLocal: true
  })
}

/**
 * Updater function to keep extension up-to-date on init
 * @param extension
 *
 * On Init, updates:
 * - userInfo (authenticated, userInfo, workspace, etc.)
 * - Dwindle (userCreds)
 */
export const initializeExtension = (extension) => {
  updateUserInfo(extension)
  updateDwindleAuth(extension)
}
