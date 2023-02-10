import { BroadcastSyncedChannel } from '@mexit/core'

const updateDwindleAuth = (extension) => {
  const authAWS = JSON.parse(localStorage.getItem('auth-aws')).state

  extension.sendToExtension({
    msgId: BroadcastSyncedChannel.DWINDLE,
    state: authAWS,
    updatedAt: +new Date(),
    fromLocal: true
  })

  console.log('AUTH', { authAWS })
}

const updateUserInfo = (extension) => {
  const userInfo = JSON.parse(localStorage.getItem('mexit-authstore')).state

  extension.sendToExtension({
    msgId: BroadcastSyncedChannel.AUTH,
    state: userInfo,
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
