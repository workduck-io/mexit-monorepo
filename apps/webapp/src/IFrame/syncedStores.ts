import { BroadcastSyncedChannel } from '@mexit/core'

import { listenChannel } from './channels'

/**
 * Stores to sync <Web - Extension>
 * @param extension
 */
export const syncStoresWithExtension = (extension) => {
  listenChannel(BroadcastSyncedChannel.USER_PREFERENCES, extension)
  listenChannel(BroadcastSyncedChannel.CONTENTS, extension)
  listenChannel(BroadcastSyncedChannel.AUTH, extension)
  listenChannel(BroadcastSyncedChannel.DATA, extension)
  listenChannel(BroadcastSyncedChannel.HIGHLIGHTS, extension)
  listenChannel(BroadcastSyncedChannel.RECENTS, extension)
  listenChannel(BroadcastSyncedChannel.LINKS, extension)
  listenChannel(BroadcastSyncedChannel.LAYOUT, extension)
  listenChannel(BroadcastSyncedChannel.DWINDLE, extension)
  listenChannel(BroadcastSyncedChannel.SNIPPETS, extension)
  listenChannel(BroadcastSyncedChannel.METADATA, extension)
  listenChannel(BroadcastSyncedChannel.DESCRIPTIONS, extension)
  listenChannel(BroadcastSyncedChannel.SMART_CAPTURE, extension)
  listenChannel(BroadcastSyncedChannel.CALENDAR, extension)
  listenChannel(BroadcastSyncedChannel.SOCKET, extension)
}
