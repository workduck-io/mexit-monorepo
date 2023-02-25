import { StoreIdentifier } from "../Types/Store"
import { createStore } from "../Utils/storeCreator"

export enum PollActions {
  'hierarchy' = 'hierarchy',
  'shared' = 'shared',
  'bookmarks' = 'bookmarks',
  'snippets' = 'snippets'
}

export const apiStoreConfig = (set, get) => ({
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

const useApiStore = createStore(apiStoreConfig, StoreIdentifier.API, false)

export { useApiStore }