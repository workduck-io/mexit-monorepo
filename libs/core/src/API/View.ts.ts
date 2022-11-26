import { apiURLs } from '../Utils/routes'
import { AxiosX } from './AxiosX'

export class ViewAPI {
  private client: AxiosX
  private versionHeaders = {
    'mex-api-ver': 'v2'
  }
  constructor(client: AxiosX) {
    this.client = client
  }

  async create(data, config?) {
    return await this.client.post(apiURLs.view.saveView, data, { ...config, headers: this.versionHeaders })
  }

  async getAll(config?) {
    return this.client.get(apiURLs.view.getAllViews, {
      ...config,
      headers: this.versionHeaders
    })
  }

  async delete(id: string, config?) {
    return await this.client.get(apiURLs.view.deleteView(id), { ...config, headers: this.versionHeaders })
  }
}
