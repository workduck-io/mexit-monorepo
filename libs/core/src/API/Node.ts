import { type Options } from 'ky'

import { type CacheConfig, type KYClient } from '@workduck-io/dwindle'

import { apiURLs } from '../Utils/routes'

export class NodeAPI {
  private client: KYClient

  constructor(client: KYClient) {
    this.client = client
  }

  async getById(id: string, cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.node.get(id), cacheConfig, options)
  }

  async save(data, options?: Options) {
    return await this.client.post(apiURLs.node.create, data, options)
  }

  async append(id: string, data, options?: Options) {
    return await this.client.patch(apiURLs.node.append(id), data, options)
  }

  async refactor(data, options?: Options) {
    return await this.client.post(apiURLs.node.refactor, data, options)
  }

  async getPublic(id: string, cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.public.getPublicNode(id), cacheConfig, options)
  }

  async makePublic(id: string, options?: Options) {
    return await this.client.patch(apiURLs.node.makePublic(id), options)
  }

  async makePrivate(id: string) {
    return await this.client.patch(apiURLs.node.makePrivate(id))
  }

  async bulkCreate(data) {
    return await this.client.post(apiURLs.node.bulkCreate, data)
  }

  async archive(namespaceId: string, nodeIds: string[], options?: Options) {
    return await this.client.put(
      apiURLs.archive.archiveInNamespace(namespaceId),
      {
        ids: nodeIds
      },
      options
    )
  }

  async unarchive(namespaceID: string, nodeIds: string[], options?: Options) {
    return await this.client.put(
      apiURLs.archive.unArchiveInNamespace(namespaceID),
      {
        ids: nodeIds
      },
      options
    )
  }

  async allArchived(cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.archive.getArchivedNodes, cacheConfig, options)
  }

  async updateMetadata(nodeid: string, metadata: any, options?: Options) {
    return await this.client.patch(apiURLs.node.updateMetadata(nodeid), metadata, options)
  }

  async deleteArchived(nodeIds: string[], options?: Options) {
    return await this.client.post(
      apiURLs.archive.deleteArchivedNodes,
      {
        ids: nodeIds
      },
      options
    )
  }
}
