import { API, mog } from '@mexit/core'

import usePortalStore from '../Stores/usePortalStore'
import { ActionGroupType, PortalType } from '../Types/Actions'
import { useAuthStore } from './../Stores/useAuth'
import { orderBy } from 'lodash'

export const usePortals = () => {
  const setApps = usePortalStore((store) => store.setApps)
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const connectPortal = usePortalStore((store) => store.connectPortal)
  const updateConnectedPortals = usePortalStore((store) => store.updateConnectedPortals)
  const setConnectedPortals = usePortalStore((store) => store.setConnectedPortals)

  const getPortals = async () => {
    try {
      const res = await API.loch.getAllServices()
      if (res) {
        setApps(res)
      }
    } catch (err) {
      mog('Unable to get apps', {})
    }
  }

  const connectToPortal = async (
    actionGroupId: string,
    serviceId: string,
    parentNodeId: string,
    namespaceId: string
  ) => {
    const workspaceId = getWorkspaceId()

    const portal: PortalType = { serviceId, parentNodeId, serviceType: actionGroupId, mexId: workspaceId, namespaceId }

    try {
      const res = await API.loch.connect(portal)
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
      const res = await API.loch.updateParent(reqBody)
      if (res) {
        updateConnectedPortals(actionGroupId, serviceId, parentNodeId)
      }
    } catch (err) {
      mog('Unable to update parent note', {})
    }
  }

  const getConnectedPortals = async () => {
    try {
      const res = await API.loch.getAllConnected()
      if (res) {
        setConnectedPortals(res)
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
