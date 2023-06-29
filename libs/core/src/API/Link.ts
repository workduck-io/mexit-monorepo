import { type Options } from 'ky'

import { type CacheConfig, type KYClient } from '@workduck-io/dwindle'

import { apiURLs } from '../Utils/routes'

export class LinkAPI {
  private client: KYClient
  constructor(client: KYClient) {
    this.client = client
  }

  async get(cacheConfig?: CacheConfig, options?: Options) {
    return this.client.get(apiURLs.links.getLink, cacheConfig, options)
  }

  async save(data, options?: Options) {
    return await this.client.post(apiURLs.links.saveLink, data, options)
  }

  async getAll(cacheConfig?: CacheConfig, options?: Options) {
    return this.client.get(apiURLs.links.getAllLinks, cacheConfig, options)
  }

  async delete(options?: Options) {
    return await this.client.delete(apiURLs.links.deleteLink, options)
  }
}
