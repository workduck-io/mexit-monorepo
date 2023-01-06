type EntityIdType = string
type PromptResult = Array<string>
type PromptResults = Array<PromptResult>

export const PromptRenderType = 'prompt'

export type PromptDataType = {
  entityId: EntityIdType
  title: string
  description: string
  variables: Array<any>
  userId: string
  updatedAt: string
  createdBy: string
}

export type PromptStoreType = {
  downloaded: Array<PromptDataType>
  created: Array<PromptDataType>
  results: Record<EntityIdType, PromptResults>
  addPromptResult: (promptId: string, result: PromptResult) => void
  getPrompt: (promptId: string) => PromptDataType | undefined
  setAllPrompts: (data: any) => void
  reset: () => void
}
