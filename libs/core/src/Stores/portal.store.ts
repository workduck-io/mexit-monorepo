import { PortalType } from '../Types/Actions'
import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

const portalStoreConfig = (set, get) => ({
  apps: {},
  setApps: (apps) => set({ apps }),

  connectedPortals: [] as Array<PortalType>,
  setConnectedPortals: (connectedPortals: []) => set({ connectedPortals }),
  connectPortal: (portal: PortalType) => {
    const connectedPortals = get().connectedPortals
    const newConnectedPortals = [...connectedPortals, portal]
    set({ connectedPortals: newConnectedPortals })
  },
  getIsPortalConnected: (actionGroupId: string) => {
    const connectedPortals = get().connectedPortals

    return connectedPortals.find((portal) => portal.serviceType === actionGroupId)
  },
  updateConnectedPortals: (actionGroupId: string, serviceId: string, parentNodeId: string) => {
    const connectedPortals = get().connectedPortals
    const newConnectedPortals = connectedPortals.map((portal) => {
      if (portal.serviceType === actionGroupId) {
        return { ...portal, serviceId, parentNodeId }
      }
      return portal
    })

    set({ connectedPortals: newConnectedPortals })
  }
})

export const usePortalStore = createStore(portalStoreConfig, StoreIdentifier.PORTAL, true)
