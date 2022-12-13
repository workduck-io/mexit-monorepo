import { PromptStoreType } from '../Types/Prompt'

export const promptStoreConstructor = (set, get): PromptStoreType => ({
  downloaded: [],
  created: [],
  setAllPrompts: (data) => {
    set({ downloaded: data.downloaded, created: data.created })
  },
  reset: () => {
    set({ downloaded: [], created: [] })
  }
})
