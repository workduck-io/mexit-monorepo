import { apiURLs } from '../Utils/routes'

import { AxiosX } from './AxiosX'

export class NodeAPI {
  private client: AxiosX

  constructor(client: AxiosX) {
    this.client = client
  }

  async getById(id: string, config?) {
    return await this.client.get(apiURLs.node.get(id), config)
  }

  async save(data, config?) {
    return await this.client.post(apiURLs.node.create, data, config)
  }

  async append(id: string, data, config?) {
    return await this.client.patch(apiURLs.node.append(id), data, config)
  }

  async refactor(data, config?) {
    return await this.client.post(apiURLs.node.refactor, data, config)
  }

  async getPublic(id: string, config?) {
    return await this.client.get(apiURLs.public.getPublicNode(id), config)
  }

  async makePublic(id: string, config?) {
    return await this.client.patch(apiURLs.node.makePublic(id), config)
  }

  async makePrivate(id: string) {
    return await this.client.patch(apiURLs.node.makePrivate(id))
  }

  async bulkCreate(data) {
    return await this.client.post(apiURLs.node.bulkCreate, data)
  }

  async archive(namespaceId: string, nodeIds: string[], config?) {
    return await this.client.put(
      apiURLs.archive.archiveInNamespace(namespaceId),
      {
        ids: nodeIds
      },
      config
    )
  }

  async unarchive(nodeIds: string[], config?) {
    return await this.client.put(
      apiURLs.archive.unArchiveNodes,
      {
        ids: nodeIds
      },
      config
    )
  }

  async allArchived(config?) {
    return await this.client.get(apiURLs.archive.getArchivedNodes, config)
  }

  async deleteArchived(nodeIds: string[], config?) {
    return await this.client.put(
      apiURLs.archive.deleteArchivedNodes,
      {
        ids: nodeIds
      },
      config
    )
  }
}
