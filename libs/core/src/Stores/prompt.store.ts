import { PromptDataType, PromptStoreType } from '../Types/Prompt'
import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

export const promptStoreConfig = (set, get): PromptStoreType => ({
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
      results: { ...results, [promptId]: [result, ...existingPromptResults] },
      resultIndexes: { ...resultIndexes, [promptId]: 0 }
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

export const usePromptStore = createStore(promptStoreConfig, StoreIdentifier.PROMPRTS, true)
