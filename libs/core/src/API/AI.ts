import { type Options } from 'ky'

import { type KYClient } from '@workduck-io/dwindle'

import { AIEvent } from '../Types'
import { apiURLs } from '../Utils/routes'

export class AiAPI {
  private client: KYClient
  constructor(client: KYClient) {
    this.client = client
  }

  async perform(data: any, options?: Options): Promise<AIEvent> {
    return await this.client.post(apiURLs.openAi.perform, data, options)
  }
}
