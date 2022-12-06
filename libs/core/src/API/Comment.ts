import { type Options } from 'ky'

import { type CacheConfig, type KYClient } from '@workduck-io/dwindle'

import { apiURLs } from '../Utils/routes'

export class CommentAPI {
  private client: KYClient
  constructor(client: KYClient) {
    this.client = client
  }

  async create(data, options?: Options) {
    return await this.client.post(apiURLs.comments.saveComment, data, options)
  }

  async get(nodeId: string, id: string, cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.comments.comment(nodeId, id), cacheConfig, options)
  }

  async delete(nodeId: string, id: string, options?: Options) {
    return await this.client.delete(apiURLs.comments.comment(nodeId, id), options)
  }

  async getAllOfNode(nodeId: string, cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.comments.allNote(nodeId), cacheConfig, options)
  }

  async deleteAllOfNode(nodeId: string, options?: Options) {
    return await this.client.delete(apiURLs.comments.allNote(nodeId), options)
  }

  async getAllOfBlock(nodeId: string, blockId: string, cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.comments.allBlock(nodeId, blockId), cacheConfig, options)
  }

  async deleteAllOfBlock(nodeId: string, blockId: string, options?: Options) {
    return await this.client.delete(apiURLs.comments.allBlock(nodeId, blockId), options)
  }

  async getAllOfThread(
    nodeId: string,
    blockId: string,
    threadId: string,
    cacheConfig?: CacheConfig,
    options?: Options
  ) {
    return await this.client.get(apiURLs.comments.allThread(nodeId, blockId, threadId), cacheConfig, options)
  }

  async deleteAllOfThread(nodeId: string, blockId: string, threadId: string, options?: Options) {
    return await this.client.delete(apiURLs.comments.allThread(nodeId, blockId, threadId), options)
  }
}
