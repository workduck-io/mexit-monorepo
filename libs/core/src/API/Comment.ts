import { apiURLs } from '../Utils/routes'
import { AxiosX } from './AxiosX'

export class CommentAPI {
  private client: AxiosX
  constructor(client: AxiosX) {
    this.client = client
  }

  async create(data, config?) {
    return await this.client.post(apiURLs.comments.saveComment, data, config)
  }

  async get(nodeId: string, id: string, config?) {
    return await this.client.get(apiURLs.comments.comment(nodeId, id), config)
  }

  async delete(nodeId: string, id: string, config?) {
    return await this.client.delete(apiURLs.comments.comment(nodeId, id), config)
  }

  async getAllOfNode(nodeId: string, config?) {
    return await this.client.get(apiURLs.comments.allNote(nodeId), config)
  }

  async deleteAllOfNode(nodeId: string, config?) {
    return await this.client.delete(apiURLs.comments.allNote(nodeId), config)
  }

  async getAllOfBlock(nodeId: string, blockId: string, config?) {
    return await this.client.get(apiURLs.comments.allBlock(nodeId, blockId), config)
  }

  async deleteAllOfBlock(nodeId: string, blockId: string, config?) {
    return await this.client.delete(apiURLs.comments.allBlock(nodeId, blockId), config)
  }

  async getAllOfThread(nodeId: string, blockId: string, threadId: string, config?) {
    return await this.client.get(apiURLs.comments.allThread(nodeId, blockId, threadId), config)
  }

  async deleteAllOfThread(nodeId: string, blockId: string, threadId: string, config?) {
    return await this.client.delete(apiURLs.comments.allThread(nodeId, blockId, threadId), config)
  }
}
