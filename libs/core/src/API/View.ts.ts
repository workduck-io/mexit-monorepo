import { type Options } from 'ky'

import { type CacheConfig, type KYClient } from '@workduck-io/dwindle'

import { apiURLs } from '../Utils/routes'

export class ViewAPI {
  private client: KYClient
  private versionHeaders = {
    'mex-api-ver': 'v2'
  }

  constructor(client: KYClient) {
    this.client = client
  }

  async create(data, options?: Options) {
    return await this.client.post(apiURLs.view.saveView, data, { ...options, headers: this.versionHeaders })
  }

  async getAll(cacheConfig?: CacheConfig, options?: Options) {
    return this.client.get(apiURLs.view.getAllViews, cacheConfig, {
      ...options,
      headers: this.versionHeaders
    })
  }

  async delete(id: string, options?: Options) {
    return await this.client.delete(apiURLs.view.deleteView(id), { ...options, headers: this.versionHeaders })
  }
}
