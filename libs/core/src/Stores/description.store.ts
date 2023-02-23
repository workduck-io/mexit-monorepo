import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

export const descriptionStoreConfig = (set, get) => ({
  descriptions: {},
  updateDescription: (snippetID, state) => {
    const oldDescriptions = get().descriptions
    delete oldDescriptions[snippetID]

    set({
      descriptions: {
        [snippetID]: state,
        ...oldDescriptions
      }
    })
  },
  initDescriptions: (descriptions) => {
    set({
      descriptions
    })
  },
  resetDescriptionStore: () => {
    set({
      descriptions: {}
    })
  }
})

const useDescriptionStore = createStore(descriptionStoreConfig, StoreIdentifier.DESCRIPTIONS, 'true')

export { useDescriptionStore }
