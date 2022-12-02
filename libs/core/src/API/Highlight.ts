import { apiURLs } from '../Utils/routes'

import { AxiosX } from './AxiosX'

export class HighlightAPI {
  private client: AxiosX
  constructor(client: AxiosX) {
    this.client = client
  }

  async save(data, config?) {
    return await this.client.post(apiURLs.highlights.saveHighlight, data, config)
  }

  async get(id: string, config?) {
    return await this.client.get(apiURLs.highlights.byId(id), config)
  }

  async delete(id: string, config?) {
    return await this.client.delete(apiURLs.highlights.byId(id), config)
  }

  async getAll(config?) {
    return await this.client.get(apiURLs.highlights.all, config)
  }

  async getAllOfUrl(urlHash: string, config?) {
    return await this.client.delete(apiURLs.highlights.allOfUrl(urlHash), config)
  }

  async deleteAllOfUrl(urlHash: string, config?) {
    return await this.client.get(apiURLs.highlights.allOfUrl(urlHash), config)
  }
}
