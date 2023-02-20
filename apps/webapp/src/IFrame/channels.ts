import { BroadcastSyncedChannel, mog, SyncMessageType } from '@mexit/core'

const BroadCastChannels: Record<string, BroadcastChannel> = {}

export const broadCastMessage = (channel: BroadcastSyncedChannel, message: SyncMessageType) => {
  if (!BroadCastChannels[channel]) BroadCastChannels[channel] = new BroadcastChannel(channel)

  mog(`[IFRAME] Broadcasting message ${channel}`, { name: channel, message, BroadCastChannels })
  BroadCastChannels[channel]?.postMessage(message)
}

export const listenChannel = (channel: BroadcastSyncedChannel, extension) => {
  if (!BroadCastChannels[channel]) BroadCastChannels[channel] = new BroadcastChannel(channel)

  // * For Messages recieved from Webapps
  BroadCastChannels[channel].onmessage = (ev: MessageEvent<SyncMessageType>) => {
    mog('[IFRAME]: Sending events to Extension', { data: ev.data, origin: ev.origin })

    try {
      extension?.sendToExtension(ev.data)
    } catch (err) {
      mog('Unable to send message to extension', { err, extension })
    }
  }
}
