import { type Options } from 'ky'

import { type KYClient, CacheConfig } from '@workduck-io/dwindle'

import { apiURLs } from '../Utils/routes'

export class ShareAPI {
  private client: KYClient

  constructor(client: KYClient) {
    this.client = client
  }

  async getSharedNodes(cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.share.allSharedNodes, cacheConfig, options)
  }

  async grantNodePermission(data, options?: Options) {
    return await this.client.post(apiURLs.share.sharedNode, data, options)
  }

  async updateNode(data, options?: Options) {
    return await this.client.post(apiURLs.share.updateNode, data, options)
  }

  async updateNodePermission(data, options?: Options) {
    return await this.client.put(apiURLs.share.sharedNode, data, options)
  }

  async revokeNodeAccess(data, options?: Options) {
    return await this.client.delete(apiURLs.share.sharedNode, data, options)
  }

  async getNodePermissions(id: string, cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.share.getUsersOfSharedNode(id), cacheConfig, options)
  }

  async getNamespacePermissions(id: string, cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.namespaces.getUsersOfShared(id), cacheConfig, options)
  }
}
