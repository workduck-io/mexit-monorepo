import { type Options } from 'ky'

import { type KYClient } from '@workduck-io/dwindle'

import { apiURLs } from '../Utils/routes'

export class AiAPI {
  private client: KYClient
  constructor(client: KYClient) {
    this.client = client
  }

  async perform(action: string, data: any, options?: Options) {
    return await this.client.post(apiURLs.openAi.perform(action), data, options)
  }

  //   async getAll(cacheConfig?: CacheConfig, options?: Options) {
  //     return await this.client.get(apiURLs.bookmarks.getAll, cacheConfig, options)
  //   }
}
