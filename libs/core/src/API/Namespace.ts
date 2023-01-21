import { type KYClient } from '@workduck-io/dwindle'

import { AccessLevel } from '../Types/Mentions'
import { apiURLs } from '../Utils/routes'

export class NamespaceAPI {
  private client: KYClient
  constructor(client: KYClient) {
    this.client = client
  }

  async create(data, config?) {
    return await this.client.post(apiURLs.namespaces.create, data, config)
  }

  async get(id: string, config?) {
    return await this.client.get(apiURLs.namespaces.get(id), config)
  }

  async getHeirarchy(config?) {
    return await this.client.get(apiURLs.namespaces.getHierarchy, config)
  }

  async update(data, config?) {
    return await this.client.patch(apiURLs.namespaces.update, data, config)
  }

  async delete(data, config?) {
    return await this.client.post(apiURLs.namespaces.deleteNamespace, data, config)
  }

  async share(id: string, userIDs: string[], accessType: AccessLevel, config?) {
    return await this.client.post(
      apiURLs.namespaces.share,
      {
        type: 'SharedNamespaceRequest',
        namespaceID: id,
        userIDToAccessTypeMap: userIDs.reduce((acc, userID) => {
          acc[userID] = accessType
          return acc
        }, {})
      },
      config
    )
  }

  async revokeAccess(namespaceID: string, userIDs: string[], config?) {
    return await this.client.delete(
      apiURLs.namespaces.delete,
      {
        namespaceID,
        userIDs
      },
      config
    )
  }

  async updateAccess(namespaceID: string, userIDToAccessTypeMap: { [userid: string]: AccessLevel }, config?) {
    return await this.client.post(
      apiURLs.namespaces.share,
      {
        namespaceID,
        userIDToAccessTypeMap
      },
      config
    )
  }

  async getPublic(id: string, config?) {
    return await this.client.get(apiURLs.public.getPublicNS(id), config)
  }

  async makePublic(id: string, config?) {
    return await this.client.patch(apiURLs.namespaces.makePublic(id), config)
  }

  async makePrivate(id: string, config?) {
    return await this.client.patch(apiURLs.namespaces.makePrivate(id), config)
  }

  async remove(nodeId: string, config?) {
    return await this.client.patch(apiURLs.bookmarks.create(nodeId), undefined, config)
  }

  async getAll(config?) {
    return await this.client.get(apiURLs.namespaces.getAll(), config)
  }
}
