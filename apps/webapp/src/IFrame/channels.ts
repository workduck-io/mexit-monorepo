import { mog } from '@mexit/core'

import { BroadcastSyncedChannel, SyncMessageType } from '../Types/Sync'

const BroadCastChannels: Record<string, BroadcastChannel> = {}

export const broadCastMessage = (channel: BroadcastSyncedChannel, message: MessageEvent<SyncMessageType>) => {
  if (!BroadCastChannels[channel]) BroadCastChannels[channel] = new BroadcastChannel(channel)

  mog(`[EXTENSION] Broadcasting message ${channel}`, { name: channel, message, BroadCastChannels })
  BroadCastChannels[channel]?.postMessage(message)
}

export const storeConnector = (channel: BroadcastSyncedChannel, extension) => {
  if (!BroadCastChannels[channel]) BroadCastChannels[channel] = new BroadcastChannel(channel)

  // * For Messages recieved from Webapps
  BroadCastChannels[channel].onmessage = (ev: MessageEvent<SyncMessageType>) => {
    console.log('[IFRAME]: Sending events to Extension', { data: ev.data, origin: ev.origin })
    try {
      extension?.sendToExtension(ev.data)
    } catch (err) {
      mog('Unable to send message to extension', { err, extension })
    }
  }
}
