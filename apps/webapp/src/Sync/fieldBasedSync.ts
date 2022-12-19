import type { PartialState, State, StoreApi } from 'zustand'

declare global {
  interface globalThis {
    __MEX_SYNCED_CHANNELS_: Set<string>
  }
}

if (!globalThis.__MEX_SYNCED_CHANNELS_) globalThis.__MEX_SYNCED_CHANNELS_ = new Set()

const getExistingSyncedChannels = (): Set<string> | undefined => {
  const syncedChannels = globalThis.__MEX_SYNCED_CHANNELS_

  // console.log('Synced Channels', { syncedChannels })

  return syncedChannels
}

export function isSupported() {
  return 'BroadcastChannel' in globalThis
}

type SyncOptions = { key: string; initialize?: boolean }

export function syncStoreState<T extends State, K extends keyof T>(
  storeName: K,
  api: StoreApi<T>,
  syncOptions?: SyncOptions
): [() => void, () => void] {
  const broadCastChannelName = syncOptions?.key
  const channels = getExistingSyncedChannels()

  if (channels?.has(broadCastChannelName)) {
    return
    // throw new Error(`${broadCastChannelName} Channel Already Exists!`)
  }
  channels.add(broadCastChannelName)

  const newBroadCastSyncChannel = new BroadcastChannel(broadCastChannelName)
  let externalUpdate = false
  let timestamp = 0

  const unsubscribeChanges = api.subscribe(
    (state) => {
      if (!externalUpdate) {
        timestamp = Date.now()
        newBroadCastSyncChannel.postMessage({ timestamp, state, msgId: storeName })
      }
      externalUpdate = false
    },
    (state) => state[storeName]
  )

  newBroadCastSyncChannel.onmessage = (evt) => {
    if (evt.data === undefined) {
      const message = { msgId: storeName, timestamp, state: api.getState()[storeName] }
      newBroadCastSyncChannel.postMessage(message)
      return
    }
    if (evt.data.timestamp <= timestamp) {
      return
    }

    externalUpdate = true
    timestamp = evt.data.timestamp

    api.setState({ [storeName]: evt.data.state } as PartialState<T>)
  }

  const sync = () => newBroadCastSyncChannel.postMessage(undefined)

  const unsubscribe = () => {
    newBroadCastSyncChannel.close()
    unsubscribeChanges()
    if (process.env.NODE_ENV !== 'production') {
      globalThis.__MEX_SYNCED_CHANNELS_.delete(newBroadCastSyncChannel)
    }
  }

  // fetches any available state
  if (syncOptions?.initialize) {
    sync()
  }
  return [sync, unsubscribe]
}
