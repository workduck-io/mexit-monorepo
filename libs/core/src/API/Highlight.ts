import { type Options } from 'ky'

import { type CacheConfig, type KYClient } from '@workduck-io/dwindle'

import { apiURLs } from '../Utils/routes'

export class HighlightAPI {
  private client: KYClient
  constructor(client: KYClient) {
    this.client = client
  }

  async save(data, options?: Options) {
    return await this.client.post(apiURLs.highlights.saveHighlight, data, options)
  }

  async get(id: string, cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.highlights.byId(id), cacheConfig, options)
  }

  async delete(id: string, options?: Options) {
    return await this.client.delete(apiURLs.highlights.byId(id), options)
  }

  async getAll(cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.highlights.all, cacheConfig, options)
  }

  async getAllOfUrl(urlHash: string, options?: Options) {
    return await this.client.delete(apiURLs.highlights.allOfUrl(urlHash), options)
  }

  async deleteAllOfUrl(urlHash: string, options?: Options) {
    return await this.client.delete(apiURLs.highlights.allOfUrl(urlHash), options)
  }
}
