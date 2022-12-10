import { type Options } from 'ky'

import { type CacheConfig, type KYClient } from '@workduck-io/dwindle'

import { apiURLs } from '../Utils/routes'

export class LochAPI {
  private client: KYClient
  constructor(client: KYClient) {
    this.client = client
  }

  async connect(data, options?: Options) {
    return await this.client.post(apiURLs.loch.connectToService, data, options)
  }

  async updateParent(data, options?: Options) {
    return await this.client.put(apiURLs.loch.updateParentNoteOfService, data, options)
  }

  async getAllServices(cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.loch.getAllServices, cacheConfig, options)
  }

  async getAllConnected(cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.loch.getConnectedServices, cacheConfig, options)
  }
}
