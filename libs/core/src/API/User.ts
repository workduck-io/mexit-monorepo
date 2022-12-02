import { apiURLs } from '../Utils/routes'

import { AxiosX } from './AxiosX'

export class UserAPI {
  private client: AxiosX
  constructor(client: AxiosX) {
    this.client = client
  }
  async getCurrent(config?) {
    return await this.client.get(apiURLs.user.getUserRecords, config)
  }

  async getByMail(mail: string, config?) {
    return await this.client.get(apiURLs.user.getFromEmail(mail), config)
  }

  async getByID(id: string, config?) {
    return await this.client.get(apiURLs.user.getFromUserId(id), config)
  }
  async updateInfo(data, config?) {
    return await this.client.put(apiURLs.user.updateInfo, data, config)
  }

  async updatePreference(userID: string, userPreferences, config?) {
    return await this.client.put(apiURLs.user.updateInfo, { id: userID, preference: userPreferences }, config)
  }
}
