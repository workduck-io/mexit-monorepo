import { PollActions } from '../Types'
import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

const apiStoreConfig = (set, get) => ({
  polling: new Set([PollActions.hierarchy]),
  addActionToPoll: (action: PollActions) => {
    const polling = get().polling
    const newActionsToPoll = polling.add(action)
    set({ polling: newActionsToPoll })
  },
  replaceAndAddActionToPoll: (action: PollActions) => {
    set({ polling: new Set([action]) })
  }
})

export const useApiStore = createStore(apiStoreConfig, StoreIdentifier.API, false)
