import { BroadcastSyncedChannel } from '../Types/Sync'
import { isSupported, syncStoreState } from './synced'
import create from 'zustand'

export const testStoreSync = () => {
  type ExtensionStore = {
    updates: string
    setUpdates: (val: string) => void
  }

  const useExtensionStore = create<ExtensionStore>((set, get) => ({
    updates: "Hey I'm Iframe Store",
    setUpdates: (val) => set({ updates: val })
  }))

  // This is required for event driven messaging, as the tabs or in our
  // case a tab and a iframe don't know about their state updates, we
  // create a channel for each other to inform of their changes
  // progressive enhancement check.
  if (isSupported()) {
    syncStoreState('updates', useExtensionStore, { key: BroadcastSyncedChannel.TEST_BROADCASTING })
  }
}
