import { StoreApi } from 'zustand'

import { BroadcastSyncedChannel, mog } from '@mexit/core'

import getStore from './storeChannel'

export type MessageType = {
  updatedAt: number
  state: any
  msgId: BroadcastSyncedChannel
}

export const UnhandledRequestsByExtension = new Set([])

export const messageHandler = (event: MessageType) => {
  UnhandledRequestsByExtension?.add(event.msgId)
  const store: StoreApi<any> = getStore(event.msgId)

  if (store) {
    Object.entries(event.state)?.map(([key, value]: [key: string, value: any]) => {
      mog(key, { value })
      store.setState((prev) => ({
        ...prev,
        [key]: value.state
      }))
    })
  }

  UnhandledRequestsByExtension?.delete(event.msgId)
}
