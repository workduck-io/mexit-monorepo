import { AppsType, PortalType } from '../Types/Actions'
import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

const portalStoreConfig = (set, get) => ({
  apps: {} as AppsType,
  connectedPortals: [] as Array<PortalType>,

  setApps: (apps: AppsType) => set({ apps }),
  setConnectedPortals: (connectedPortals) => set({ connectedPortals }),
  connectPortal: (portal: PortalType) => {
    const connectedPortals = get().connectedPortals
    const newConnectedPortals = [...connectedPortals, portal]
    set({ connectedPortals: newConnectedPortals })
  },
  getIsPortalConnected: (actionGroupId: string) => {
    const connectedPortals = get().connectedPortals

    return connectedPortals.find((portal: PortalType) => portal.serviceType === actionGroupId)
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

export const usePortalStore = createStore(portalStoreConfig, StoreIdentifier.PORTAL, true, {
  storage: {
    web: localStorage
  }
})
