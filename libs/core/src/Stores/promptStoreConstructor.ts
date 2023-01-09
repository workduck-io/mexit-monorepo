import { PromptDataType, PromptStoreType } from '../Types/Prompt'

export const promptStoreConstructor = (set, get): PromptStoreType => ({
  prompts: {},
  results: {},
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
    set({ results: { ...results, [promptId]: [...existingPromptResults, result] } })
  },
  setAllPrompts: (prompts) => {
    set({ prompts })
  },
  reset: () => {
    set({ prompts: {}, providers: [], results: {} })
  }
})
