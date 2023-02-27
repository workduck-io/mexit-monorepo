import { StoreIdentifier } from "../Types/Store"
import { createStore } from "../Utils/storeCreator"

const versionStoreConfig = (set, get) => ({
  setVersion: (version: string) => {
    set({ version: version })
  }
})

export const useVersionStore = createStore(versionStoreConfig, StoreIdentifier.VERSION, true)
