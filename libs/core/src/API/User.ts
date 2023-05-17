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

  async updatePreference(userPreferences, options?: Options) {
    return await this.client.put(apiURLs.user.updatePreference, { preference: userPreferences }, options)
  }

  async registerStatus(cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.user.registerStatus, cacheConfig, options)
  }

  async getAllUsersOfWorkspace(cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.user.getAllUserRecordsOfWorkspace, cacheConfig, options)
  }

  async addExistingUserToWorkspace(inviteCode: string, options?: Options) {
    return await this.client.post(apiURLs.user.addExistingUserToWorkspace, { invite: inviteCode }, options)
  }
}
