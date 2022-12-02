import { apiURLs } from '../Utils/routes'

import { AxiosX } from './AxiosX'

export class LochAPI {
  private client: AxiosX
  constructor(client: AxiosX) {
    this.client = client
  }

  async get(nodeId: string, config?) {
    return await this.client.post(apiURLs.bookmarks.create(nodeId), undefined, config)
  }

  async connect(data, config?) {
    return await this.client.post(apiURLs.loch.connectToService, data, config)
  }

  async updateParent(data, config?) {
    return await this.client.put(apiURLs.loch.updateParentNoteOfService, data, config)
  }

  async getAllServices(config?) {
    return await this.client.get(apiURLs.loch.getAllServices, config)
  }

  async getAllConnected(config?) {
    return await this.client.get(apiURLs.loch.getConnectedServices, config)
  }
}
