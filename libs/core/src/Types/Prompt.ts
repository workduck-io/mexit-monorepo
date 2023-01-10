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
  category: string
}

export interface UserPromptAuthInfo {
  userId: string
  workspaceId: string
  auth: {
    authData?: {
      accessToken: string
    }
    authMetadata?: {
      provider: string
      // how many times the user has used the api
      usage: number
      // when the api usage will be limited for free usage
      limit: number
      // when the api usage will be reset
      reset?: number
    }
  }
}

export type PromptProviderType = {
  actionGroupId: string
  authConfig: {
    authURL: string
  }
  icon: string
  name: string
  description: string
}

export type PromptStoreType = {
  prompts: Record<string, Array<PromptDataType>>
  results: Record<EntityIdType, PromptResults>
  providers: Array<PromptProviderType>
  setPromptProviders: (providers: Array<PromptProviderType>) => void
  userPromptAuthInfo?: UserPromptAuthInfo
  setUserPromptAuthInfo: (userPromptAuthInfo: UserPromptAuthInfo) => void
  addPromptResult: (promptId: string, result: PromptResult) => void
  getPrompt: (promptId: string) => PromptDataType | undefined
  setAllPrompts: (data: any) => void
  getAllPrompts: () => Array<PromptDataType>
  reset: () => void
}
