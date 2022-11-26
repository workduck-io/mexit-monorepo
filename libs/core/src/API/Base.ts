import { AxiosInstance } from 'axios'

import { AxiosX } from './AxiosX'
import { NodeAPI } from './Node'
import { ShareAPI } from './Share'
import { SnippetAPI } from './Snippet'

let instance
class APIClass {
  private client: AxiosX
  public node: NodeAPI
  public share: ShareAPI
  public snippet: SnippetAPI
  private static instance: APIClass

  constructor() {
    if (instance) {
      throw new Error('New instance cannot be created!!')
    }

    instance = this
  }
  init(client: AxiosInstance) {
    this.client = new AxiosX(client)
    this.node = new NodeAPI(this.client)
    this.share = new ShareAPI(this.client)
    this.snippet = new SnippetAPI(this.client)
  }
  setWorkspaceHeader(workspaceId: string) {
    this.client.setHeader(workspaceId)
  }
}

export const API = new APIClass()
