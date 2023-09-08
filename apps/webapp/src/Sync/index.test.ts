import { create } from 'zustand'

import { BroadcastSyncedChannel } from '@mexit/core'

import { syncStoreState } from './syncStore'

export const testStoreSync = () => {
  type ExtensionStore = {
    updates: string
    setUpdates: (val: string) => void
  }

  const useExtensionStore = create<ExtensionStore>()((set, get) => ({
    updates: "Hey I'm Iframe Store",
    setUpdates: (val) => set({ updates: val })
  }))

  // This is required for event driven messaging, as the tabs or in our
  // case a tab and a iframe don't know about their state updates, we
  // create a channel for each other to inform of their changes
  // progressive enhancement check.
  if ('BroadcastChannel' in globalThis) {
    syncStoreState(useExtensionStore, {
      name: BroadcastSyncedChannel.TEST_BROADCASTING,
      sync: [{ field: 'updates' }]
    })
  }
}
