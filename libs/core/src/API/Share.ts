import { apiURLs } from '../Utils/routes'
import { AxiosX } from './AxiosX'

export class ShareAPI {
  private client: AxiosX

  constructor(client: AxiosX) {
    this.client = client
  }

  async updateNode(data, config) {
    return await this.client.post(apiURLs.share.updateNode, data, config)
  }
}
