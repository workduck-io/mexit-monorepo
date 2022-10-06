export interface Description {
  [snippetID: string]: {
    rawText: string
  }
}

export interface DescriptionStoreState {
  descriptions: Description
  updateDescription: (snippetID: string, rawText: string) => void
  initDescriptions: (descriptions: Description) => void
  resetDescriptionStore: () => void
}

export const descriptionStoreConstructor = (set, get) => ({
  descriptions: {},
  updateDescription: (snippetID, rawText) => {
    const oldDescriptions = get().descriptions
    delete oldDescriptions[snippetID]

    set({
      descriptions: {
        [snippetID]: {
          rawText
        },
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
