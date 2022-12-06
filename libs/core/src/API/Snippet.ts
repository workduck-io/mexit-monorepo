import { type Options } from 'ky'

import { type CacheConfig, type KYClient } from '@workduck-io/dwindle'

import { apiURLs } from '../Utils/routes'

export class SnippetAPI {
  private client: KYClient

  constructor(client: KYClient) {
    this.client = client
  }

  async getById(id: string, cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.snippet.getById(id), cacheConfig, options)
  }

  async create(data, options?: Options) {
    return await this.client.post(apiURLs.snippet.create, data, options)
  }

  async deleteAllVersions(id: string, options?: Options) {
    return await this.client.delete(apiURLs.snippet.deleteAllVersionsOfSnippet(id), options)
  }

  async allOfWorkspace(cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.snippet.getAllSnippetsByWorkspace, cacheConfig, options)
  }
}
