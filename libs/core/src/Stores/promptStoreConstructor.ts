import { PromptStoreType } from '../Types/Prompt'

export const promptStoreConstructor = (set, get): PromptStoreType => ({
  downloaded: [],
  created: [],
  defaults: [],
  results: {},
  promptProviders: [],
  setPromptProviders: (promptProviders) => {
    set({ promptProviders })
  },
  setUserPromptAuthInfo(userPromptAuthInfo) {
    set({ userPromptAuthInfo })
  },
  getPrompt: (promptId) => {
    const downloadedPrompt = get().downloaded.find((prompt) => prompt.entityId === promptId)
    if (downloadedPrompt) return downloadedPrompt

    const createdPrompt = get().created.find((prompt) => prompt.entityId === promptId)
    if (createdPrompt) return createdPrompt
  },
  addPromptResult: (promptId, result) => {
    const results = get().results
    const existingPromptResults = results[promptId] ?? []
    set({ results: { ...results, [promptId]: [...existingPromptResults, result] } })
  },
  setAllPrompts: (data) => {
    set({ downloaded: data.downloaded, created: data.created })
  },
  reset: () => {
    set({ downloaded: [], created: [] })
  }
})
