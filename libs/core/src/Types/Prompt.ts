export type PromptDataType = {
  entityId: string
  title: string
  description: string
  variables: Array<any>
  userId: string
}

export type PromptStoreType = {
  downloaded: Array<PromptDataType>
  created: Array<PromptDataType>
  setAllPrompts: (data: any) => void
  reset: () => void
}
