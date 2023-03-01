import { get } from 'idb-keyval'

import { BroadcastSyncedChannel } from '@mexit/core'

const updateDwindleAuth = (extension) => {
  const authAWS = JSON.parse(localStorage.getItem('auth-aws'))
  extension.sendToExtension({
    msgId: BroadcastSyncedChannel.DWINDLE,
    state: authAWS,
    updatedAt: +new Date(),
    fromLocal: true
  })
}


const updateUserInfo = async (extension) => {
  const storeName = 'mexit-authstore-webapp';
  const data = await get(storeName);
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
