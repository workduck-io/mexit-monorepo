import { type Options } from 'ky'

import { type CacheConfig, type KYClient } from '@workduck-io/dwindle'

import { apiURLs } from '../Utils/routes'

export class PromptAPI {
  private client: KYClient
  constructor(client: KYClient) {
    this.client = client
  }

  async generateResult(data, options?: Options) {
    return await this.client.post(
      apiURLs.prompt.generateResult,
      {
        options: {
          max_tokens: 1000,
          iterations: 1
        },
        ...data
      },
      options
    )
  }

  async getUserPromptsAuth(cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.prompt.promptUserAuthInfo, cacheConfig, options)
  }

  async getAllPromptProviders(cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.prompt.getAllPromptsProvider, cacheConfig, options)
  }

  async updateUserPromptsAuth(data, options?: Options) {
    return await this.client.post(apiURLs.prompt.promptUserAuthInfo, data, options)
  }

  async getAllPrompts(cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.prompt.getAllPrompts, cacheConfig, options)
  }
}
