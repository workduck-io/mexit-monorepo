import { type Options } from 'ky'

import { type CacheConfig, type KYClient } from '@workduck-io/dwindle'

import { apiURLs } from '../Utils/routes'

export class ReactionAPI {
  private client: KYClient
  constructor(client: KYClient) {
    this.client = client
  }

  async react(data, options?: Options) {
    return await this.client.post(apiURLs.reactions.react, data, options)
  }

  async getAllOfNode(nodeId: string, cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.reactions.allNote(nodeId), cacheConfig, options)
  }

  async getAllOfBlock(nodeId: string, blockId: string, cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.reactions.allBlock(nodeId, blockId), cacheConfig, options)
  }

  async getDetailedOfBlock(nodeId: string, blockId: string, cacheConfig?: CacheConfig, options?: Options) {
    return await this.client.get(apiURLs.reactions.blockReactionDetails(nodeId, blockId), cacheConfig, options)
  }
}
