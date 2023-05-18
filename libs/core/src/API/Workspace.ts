import { type Options } from 'ky'

import { type CacheConfig, type KYClient } from '@workduck-io/dwindle'

import { DefaultMIcons, getMIcon, Workspace } from '../Types'
import { apiURLs } from '../Utils/routes'

export class WorkspaceAPI {
  private client: KYClient

  constructor(client: KYClient) {
    this.client = client
  }

  async getAllWorkspaces(cacheConfig?: CacheConfig, options?: Options): Promise<Workspace[]> {
    const workspaces = await this.client.get(apiURLs.workspace.all, cacheConfig, options)
    if (workspaces) {
      return workspaces.map((item) => {
        const imageUrl = item.workspaceMetadata?.imageUrl
        const icon = imageUrl ? getMIcon('URL', imageUrl) : DefaultMIcons.WORKSPACE

        return {
          id: item.id,
          name: item.name,
          icon,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        } as Workspace
      })
    }

    return []
  }

  async getWorkspaceByIds(data, options?: Options): Promise<Record<string, Workspace>> {
    const workspaces = await this.client.post(apiURLs.workspace.ids, data, options)

    return workspaces
  }

  async update(data, config?) {
    return await this.client.patch(apiURLs.workspace.update, data, config)
  }
}
