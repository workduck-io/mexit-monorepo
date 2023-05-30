import { type Options } from 'ky'

import { type CacheConfig, type KYClient } from '@workduck-io/dwindle'

import { PersistAuth } from '../Types'
import { apiURLs } from '../Utils/routes'

export class CalendarAPI {
  private client: KYClient
  constructor(client: KYClient) {
    this.client = client
  }

  async persistAuth(data: PersistAuth, options?: Options) {
    return await this.client.post(apiURLs.calendar.persistAuth, data, options)
  }

  async getGoogleCalendarEvents(url: string, cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(url, cacheConfig, options)
  }

  async getGoogleCalendarNewToken(cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.calendar.getGoogleCalendarNewToken, cacheConfig, options)
  }

  async getAllCalendarProviders(cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.calendar.getAllCalendarsProvider, cacheConfig, options)
  }

  async getGoogleCalendarAuthUrl(config?) {
    return await this.client.get<any>(apiURLs.calendar.getGoogleCalendarAuthUrl, config)
  }
}
