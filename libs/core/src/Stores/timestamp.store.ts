import { StoreIdentifier } from '../Types'
import { createStore } from '../Utils/storeCreator'

const timestampStoreConfig = (set, get) => ({
  timestamp: null as string,
  setTimestamp: (newTimestamp: string) => {
    set({ timestamp: newTimestamp })
  }
})

export const useTimestampStore = createStore(timestampStoreConfig, StoreIdentifier.TIMESTAMP, true)
