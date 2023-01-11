import { PromptDataType, PromptStoreType } from '../Types/Prompt'

export const promptStoreConstructor = (set, get): PromptStoreType => ({
  prompts: {},
  results: {},
  resultIndexes: {},
  providers: [],
  setPromptProviders: (providers) => {
    set({ providers })
  },
  setUserPromptAuthInfo(userPromptAuthInfo) {
    set({ userPromptAuthInfo })
  },
  getPrompt: (promptId) => {
    const promptsArray = get().prompts

    for (const key in promptsArray) {
      const isPresent = promptsArray[key]?.find((prompt) => prompt.entityId === promptId)
      if (isPresent) return isPresent
    }
  },
  getAllPrompts: () => {
    const promptsData = get().prompts
    return Object.values(promptsData).reduce((prev: Array<PromptDataType>, current: Array<PromptDataType>) => {
      return [...prev, ...current]
    }, []) as Array<PromptDataType>
  },
  addPromptResult: (promptId, result) => {
    const results = get().results
    const existingPromptResults = results[promptId] ?? []
    const resultIndexes = get().resultIndexes

    set({
      results: { ...results, [promptId]: [...existingPromptResults, result] },
      resultIndexes: { ...resultIndexes, [promptId]: existingPromptResults.length }
    })
  },
  setAllPrompts: (prompts) => {
    set({ prompts })
  },
  setResultIndex: (promptId, index) => {
    set({ resultIndexes: { ...get().resultIndexes, [promptId]: index } })
  },
  reset: () => {
    set({ prompts: {}, providers: [], results: {}, resultIndexes: {}, userPromptAuthInfo: undefined })
  }
})
