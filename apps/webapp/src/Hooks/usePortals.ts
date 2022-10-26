import { orderBy } from 'lodash'
import { client } from '@workduck-io/dwindle'

import { apiURLs, mog, WORKSPACE_HEADER } from '@mexit/core'

import { useAuthStore } from './../Stores/useAuth'
import usePortalStore from '../Stores/usePortalStore'
import { ActionGroupType, PortalType } from '../Types/Actions'

export const usePortals = () => {
  const setApps = usePortalStore((store) => store.setApps)
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const connectPortal = usePortalStore((store) => store.connectPortal)
  const updateConnectedPortals = usePortalStore((store) => store.updateConnectedPortals)
  const setConnectedPortals = usePortalStore((store) => store.setConnectedPortals)

  const getPortals = async () => {
    try {
      const res = await client.get<Record<string, ActionGroupType>>(apiURLs.getLochServices(), {
        headers: {
          [WORKSPACE_HEADER]: getWorkspaceId()
        }
      })

      if (res) {
        setApps(res.data)
      }
    } catch (err) {
      mog('Unable to get apps', {})
    }
  }

  const connectToPortal = async (actionGroupId: string, serviceId: string, parentNodeId: string, namespaceId: string) => {
    const workspaceId = getWorkspaceId()

    const portal: PortalType = { serviceId, parentNodeId, serviceType: actionGroupId, mexId: workspaceId, namespaceId }

    try {
      const res = client.post(apiURLs.connectToLochService(), portal, {
        headers: {
          [WORKSPACE_HEADER]: getWorkspaceId()
        }
      })
      if (res) {
        connectPortal(portal)
      }
    } catch (err) {
      mog('Unable to connect to portal', {})
    }
  }

  const updateParentNote = async (
    actionGroupId: string,
    serviceId: string,
    parentNodeId: string,
    namespaceId: string
  ) => {
    const reqBody = {
      serviceId,
      serviceType: actionGroupId,
      parentNodeId,
      namespaceId
    }

    try {
      const res = await client.put(apiURLs.updateParentNoteOfService(), reqBody, {
        headers: {
          [WORKSPACE_HEADER]: getWorkspaceId()
        }
      })
      if (res) {
        updateConnectedPortals(actionGroupId, serviceId, parentNodeId)
      }
    } catch (err) {
      mog('Unable to update parent note', {})
    }
  }

  const getConnectedPortals = async () => {
    try {
      const res = (await client.get(apiURLs.getConnectedLochServices(), {
        headers: {
          [WORKSPACE_HEADER]: getWorkspaceId()
        }
      })) as any

      if (res) {
        setConnectedPortals(res.data)
      }
    } catch (err) {
      mog('Unable to get connected portals', { err })
    }
  }

  const initPortals = async () => {
    try {
      const res = await Promise.all([getPortals(), getConnectedPortals()])
      if (res) mog('Portals initialized', {})
    } catch (err) {
      mog('Unable to init portals', { err })
    }
  }

  const sortPortals = (
    portals: Record<string, ActionGroupType>,
    getIsConnected: (item: ActionGroupType) => boolean
  ) => {
    const itemsToSort = Object.values(portals).map((item) => ({ ...item, connected: getIsConnected(item) }))

    const res = orderBy(itemsToSort, ['connected', 'actionGroupId'], ['desc', 'asc'])
    return res
  }

  return {
    getPortals,
    initPortals,
    connectToPortal,
    updateParentNote,
    getConnectedPortals,
    sortPortals
  }
}
