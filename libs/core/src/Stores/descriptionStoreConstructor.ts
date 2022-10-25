interface DescriptionState {
  rawText: string
  truncatedContent: any[]
}

export interface Description {
  [snippetID: string]: DescriptionState
}

export interface DescriptionStoreState {
  descriptions: Description
  updateDescription: (snippetID: string, state: DescriptionState) => void
  initDescriptions: (descriptions: Description) => void
  resetDescriptionStore: () => void
}

export const descriptionStoreConstructor = (set, get) => ({
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
