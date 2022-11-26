import { apiURLs } from '../Utils/routes'
import { AxiosX } from './AxiosX'

export class ShareAPI {
  private client: AxiosX

  constructor(client: AxiosX) {
    this.client = client
  }

  async getSharedNodes(config?) {
    return await this.client.get(apiURLs.share.allSharedNodes, config)
  }

  async updateNode(data, config?) {
    return await this.client.post(apiURLs.share.updateNode, data, config)
  }

  async updateNodePermission(data, config?) {
    return await this.client.put(apiURLs.share.updateNode, data, config)
  }

  async revokeNodeAccess(data, config?) {
    return await this.client.delete(apiURLs.share.updateNode, { ...config, data })
  }

  async getNodePermissions(id: string, config?) {
    return await this.client.get(apiURLs.share.getUsersOfSharedNode(id), config)
  }

  async getNamespacePermissions(id: string, config?) {
    return await this.client.get(apiURLs.namespaces.getUsersOfShared(id), config)
  }
}
