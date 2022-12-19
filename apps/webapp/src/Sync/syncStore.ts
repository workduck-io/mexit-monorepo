import { isEmpty, isEqual } from 'lodash'
import type { State, StoreApi } from 'zustand'

import { BroadcastSyncedChannel, PartialSyncStateType, SyncField, SyncMessageType } from '@mexit/core'

if (!globalThis.__MEX_SYNCED_CHANNELS_) globalThis.__MEX_SYNCED_CHANNELS_ = new Set()

const getExistingSyncedChannels = (): Set<BroadcastSyncedChannel> | undefined => {
  const syncedChannels = globalThis.__MEX_SYNCED_CHANNELS_

  // mog('Synced Channels', { syncedChannels })

  return syncedChannels
}

export const syncStoreState = <T extends State, K extends keyof T>(
  store: StoreApi<T>,
  options: { sync: SyncField<K>[]; name: BroadcastSyncedChannel; init?: boolean }
) => {
  const broadCastChannelName = options.name
  const channels = getExistingSyncedChannels()

  if (channels?.has(broadCastChannelName)) {
    return
    // throw new Error(`${broadCastChannelName} Channel Already Exists!`)
  }
  channels.add(broadCastChannelName)

  const newBroadCastSyncChannel = new BroadcastChannel(options.name)

  let isIncomingMessage = false
  let lastSyncedStateTimestamp = 0

  const subscribedChanges = store.subscribe((currentStoreState, prevStoreState) => {
    if (isIncomingMessage) {
      isIncomingMessage = false
      return
    }

    lastSyncedStateTimestamp = +new Date()
    const partialState: Record<string, PartialSyncStateType> = options.sync.reduce((prev, current) => {
      const field = current.field
      const storeState = currentStoreState[field]

      const canUpdateAtomicField = typeof storeState === 'object' && current.atomicField

      if (!isEqual(storeState, prevStoreState[field])) {
        return {
          ...prev,
          [field]: canUpdateAtomicField
            ? { state: storeState[current.atomicField], atomicField: current.atomicField }
            : { state: storeState }
        }
      }

      return prev
    }, {} as Record<string, PartialSyncStateType>)

    if (!isEmpty(partialState)) {
      newBroadCastSyncChannel.postMessage({
        msgId: broadCastChannelName,
        updatedAt: lastSyncedStateTimestamp,
        state: partialState
      })
    }
  })

  newBroadCastSyncChannel.onmessage = (ev: MessageEvent<SyncMessageType>) => {
    const incomingEventState = ev.data?.state
    const incomingEventUpdatedAt = ev.data?.updatedAt

    if (ev.data?.init) {
      const state = options.sync.reduce((prev, current) => {
        const field = current.field
        const currentState = store.getState()?.[field]

        const canUpdateAtomicField = typeof currentState === 'object' && current.atomicField

        return {
          ...prev,
          [field]: canUpdateAtomicField
            ? { state: currentState[current.atomicField], atomicField: current.atomicField }
            : { state: currentState }
        }
      }, {})

      newBroadCastSyncChannel.postMessage({ msgId: broadCastChannelName, updatedAt: +new Date(), state })
    } else if (incomingEventUpdatedAt > lastSyncedStateTimestamp) {
      // * Update Store
      if (incomingEventState) {
        isIncomingMessage = true
        lastSyncedStateTimestamp = incomingEventUpdatedAt

        Object.entries(incomingEventState)?.map(([key, value]) => {
          store.setState((prev) => ({
            ...prev,
            [key]: value?.atomicField ? { ...prev[key], [value.atomicField]: value.state } : value.state
          }))
        })
      }
    }
  }

  if (options.init) {
    newBroadCastSyncChannel.postMessage({ msgId: broadCastChannelName, init: true })
  }
}
