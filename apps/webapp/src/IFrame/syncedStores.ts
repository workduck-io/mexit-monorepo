import { BroadcastSyncedChannel } from '@mexit/core'

import { storeConnector } from './channels'

// * Stores to sync <Web - Extension>
export const syncStoresWithExtension = (extension) => {
  storeConnector(BroadcastSyncedChannel.USER_PREFERENCES, extension)
  storeConnector(BroadcastSyncedChannel.CONTENTS, extension)
  storeConnector(BroadcastSyncedChannel.AUTH, extension)
  storeConnector(BroadcastSyncedChannel.DATA, extension)
  storeConnector(BroadcastSyncedChannel.HIGHLIGHTS, extension)
  storeConnector(BroadcastSyncedChannel.RECENTS, extension)
  storeConnector(BroadcastSyncedChannel.LINKS, extension)
  storeConnector(BroadcastSyncedChannel.SNIPPETS, extension)
  storeConnector(BroadcastSyncedChannel.DESCRIPTIONS, extension)
  storeConnector(BroadcastSyncedChannel.SMART_CAPTURE, extension)
}
