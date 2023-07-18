import { type Options } from 'ky'

import { type CacheConfig, type KYClient } from '@workduck-io/dwindle'

import { apiURLs } from '../Utils/routes'

export class BroadcastAPI {
  private client: KYClient
  constructor(client: KYClient) {
    this.client = client
  }

  async getAll(cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.broadcast.getAll, cacheConfig, options)
  }
}
