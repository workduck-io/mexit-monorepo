import { apiURLs } from '../Utils/routes'

import { AxiosX } from './AxiosX'

export class BookmarkAPI {
  private client: AxiosX
  constructor(client: AxiosX) {
    this.client = client
  }

  async create(nodeId: string, config?) {
    return await this.client.post(apiURLs.bookmarks.create(nodeId), undefined, config)
  }

  async remove(nodeId: string, config?) {
    return await this.client.patch(apiURLs.bookmarks.create(nodeId), undefined, config)
  }

  async getAll(config?) {
    return await this.client.get(apiURLs.bookmarks.getAll, config)
  }
}
