import { apiURLs } from '../Utils/routes'

import { AxiosX } from './AxiosX'

export class SmartCaptureAPI {
  private client: AxiosX

  constructor(client: AxiosX) {
    this.client = client
  }

  async getPublic(config?) {
    return await this.client.get(apiURLs.smartcapture.public, config)
  }
}
