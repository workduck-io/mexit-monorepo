import { AxiosInstance } from 'axios'
import md5 from 'md5'

import { WORKSPACE_HEADER } from '../Data/constants'
import { getData } from './utils'

export class AxiosX {
  private client: AxiosInstance
  private urlHash: Record<string, number>
  constructor(client: AxiosInstance) {
    this.client = client
    this.urlHash = {}
  }
  async get(url: string, config?) {
    const key = `HASH_${md5(url)}`
    if (config?.cache && key in this.urlHash && Date.now() - this.urlHash[key] < (config.cache.expiry ?? 120000)) {
      return
    } else {
      const item = await this.client.get(url, config)
      if (config?.cache) {
        this.urlHash[key] = Date.now()
      }
      return getData(item)
    }
  }
  async post(url: string, data, config?) {
    const item = await this.client.post(url, data, config)
    return getData(item)
  }
  async patch(url: string, data?, config?) {
    const item = await this.client.patch(url, data, config)
    return getData(item)
  }
  async delete(url: string, config?) {
    const item = await this.client.delete(url, config)
    return getData(item)
  }
  async put(url: string, data, config?) {
    const item = await this.client.put(url, data, config)
    return getData(item)
  }

  setHeader(workspaceId: string) {
    this.client.interceptors.request.use(
      (config) => {
        config.headers[WORKSPACE_HEADER] = workspaceId
        config.headers['Accept'] = 'application/json, text/plain, */*'
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }
}
