import { type Options } from 'ky'

import { type CacheConfig, type KYClient } from '@workduck-io/dwindle'

import { apiURLs } from '../Utils/routes'

export class ReminderAPI {
  private client: KYClient
  constructor(client: KYClient) {
    this.client = client
  }

  async get(id: string, cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.reminders.reminderByID(id), cacheConfig, options)
  }

  async save(data, options?: Options) {
    return await this.client.post(apiURLs.reminders.saveReminder, data, options)
  }

  async getAllOfWorkspace(cacheConfig?: CacheConfig, options?: Options) {
    return this.client.get(apiURLs.reminders.remindersOfWorkspace, cacheConfig, options)
  }

  async getAllOfNode(nodeId: string, cacheConfig?: CacheConfig, options?: Options) {
    return this.client.get(apiURLs.reminders.remindersOfNode(nodeId), cacheConfig, options)
  }

  async delete(id: string, options?: Options) {
    return await this.client.delete(apiURLs.reminders.reminderByID(id), options)
  }

  async deleteAllOfNode(nodeId: string, options?: Options) {
    return await this.client.delete(apiURLs.reminders.remindersOfNode(nodeId), options)
  }
}
