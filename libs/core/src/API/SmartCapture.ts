import { type Options } from 'ky'

import { type CacheConfig, type KYClient } from '@workduck-io/dwindle'

import { apiURLs } from '../Utils/routes'

export class SmartCaptureAPI {
  private client: KYClient

  constructor(client: KYClient) {
    this.client = client
  }

  async getPublic(cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.smartcapture.public, cacheConfig, options)
  }
}
