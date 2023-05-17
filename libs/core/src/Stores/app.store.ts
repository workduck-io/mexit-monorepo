import { FeatureFlags, FeatureFlagsType } from '../Types/FeatureFlags'
import { StoreIdentifier } from '../Types/Store'
import { IS_DEV } from '../Utils/config'
import { getLocalStorage } from '../Utils/storage'
import { createStore } from '../Utils/storeCreator'

const defaultFeatureFlags: FeatureFlagsType = {
  [FeatureFlags.PRESENTATION]: IS_DEV,
  [FeatureFlags.ACTIONS]: false
}

const appStoreConfig = (set, get) => ({
  featureFlags: defaultFeatureFlags,
  setFeatureFlags: (featureFlags: FeatureFlagsType) => {
    set({
      featureFlags
    })
  },
  version: undefined as string,
  setVersion: (version: string) => {
    set({ version: version })
  },
  clear: () =>
    set({
      manualReload: false
    }),
  manualReload: false,
  setManualReload: (manualReload: boolean) => set({ manualReload })
})

export const useAppStore = createStore(appStoreConfig, StoreIdentifier.APP, true, {
  storage: {
    web: getLocalStorage()
  }
})
