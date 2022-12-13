import { type Options } from 'ky'

import { type CacheConfig, type KYClient } from '@workduck-io/dwindle'

import { apiURLs } from '../Utils/routes'

export class PromptAPI {
  private client: KYClient
  constructor(client: KYClient) {
    this.client = client
  }

  async generateResult(promptId: string, data, options?: Options) {
    return await this.client.post(apiURLs.prompt.generateResult(promptId), data, options)
  }

  async getAllPrompts(cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.prompt.getAllPrompts, cacheConfig, options)
  }
}
