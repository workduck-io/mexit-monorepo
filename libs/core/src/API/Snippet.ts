import { apiURLs } from '../Utils/routes'
import { AxiosX } from './AxiosX'

export class SnippetAPI {
  private client: AxiosX

  constructor(client: AxiosX) {
    this.client = client
  }

  async getById(id: string, config?) {
    return await this.client.get(apiURLs.snippet.getById(id), config)
  }

  async create(data, config?) {
    return await this.client.post(apiURLs.snippet.create, data, config)
  }

  async deleteAllVersions(id: string, config?) {
    return await this.client.delete(apiURLs.snippet.deleteAllVersionsOfSnippet(id), config)
  }

  async allOfWorkspace(config?) {
    return await this.client.get(apiURLs.snippet.getAllSnippetsByWorkspace, config)
  }
}
