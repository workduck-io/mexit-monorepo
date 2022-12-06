import { type Options } from 'ky'

import { type CacheConfig, type KYClient } from '@workduck-io/dwindle'

import { apiURLs } from '../Utils/routes'

export class BookmarkAPI {
  private client: KYClient
  constructor(client: KYClient) {
    this.client = client
  }

  async create(nodeId: string, options?: Options) {
    return await this.client.post(apiURLs.bookmarks.create(nodeId), undefined, options)
  }

  async remove(nodeId: string, options?: Options) {
    return await this.client.patch(apiURLs.bookmarks.create(nodeId), undefined, options)
  }

  async getAll(cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.bookmarks.getAll, cacheConfig, options)
  }
}
