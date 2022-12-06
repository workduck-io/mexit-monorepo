import { type Options } from 'ky'

import { type CacheConfig, type KYClient } from '@workduck-io/dwindle'

import { apiURLs } from '../Utils/routes'

export class UserAPI {
  private client: KYClient
  constructor(client: KYClient) {
    this.client = client
  }
  async getCurrent(cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.user.getUserRecords, cacheConfig, options)
  }

  async getByMail(mail: string, cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.user.getFromEmail(mail), cacheConfig, options)
  }

  async getByID(id: string, cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.user.getFromUserId(id), cacheConfig, options)
  }
  async updateInfo(data, options?: Options) {
    return await this.client.put(apiURLs.user.updateInfo, data, options)
  }

  async updatePreference(userID: string, userPreferences, options?: Options) {
    return await this.client.put(apiURLs.user.updateInfo, { id: userID, preference: userPreferences }, options)
  }
}
