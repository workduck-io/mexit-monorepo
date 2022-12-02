import { apiURLs } from '../Utils/routes'

import { AxiosX } from './AxiosX'

export class LinkAPI {
  private client: AxiosX
  constructor(client: AxiosX) {
    this.client = client
  }

  async save(data, config?) {
    return await this.client.post(apiURLs.links.saveLink, data, config)
  }

  async getAll(config?) {
    return this.client.get(apiURLs.links.getLinks, config)
  }

  async delete(hashURL: string, config?) {
    return await this.client.delete(apiURLs.links.deleteLink(hashURL), config)
  }
}
