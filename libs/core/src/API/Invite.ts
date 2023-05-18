import { type Options } from 'ky'

import { type CacheConfig, type KYClient } from '@workduck-io/dwindle'

import { apiURLs } from '../Utils/routes'

export class InviteAPI {
  private client: KYClient
  constructor(client: KYClient) {
    this.client = client
  }

  async create(data, options?: Options) {
    return await this.client.post(apiURLs.invite.create, data, options)
  }

  async get(inviteId: string, cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.invite.getById(inviteId), cacheConfig, options)
  }

  async getAll(cacheConfig?: CacheConfig, options?: Options) {
    return this.client.get(apiURLs.invite.getAll, cacheConfig, options)
  }

  async delete(inviteId: string, options?: Options) {
    return await this.client.delete(apiURLs.invite.getById(inviteId), options)
  }
}
