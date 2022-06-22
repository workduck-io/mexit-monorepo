import create from 'zustand'
import { persist } from 'zustand/middleware'

import { IDBStorage } from '@mexit/core'

import { ActionGroupType, PortalType } from '../Types/Actions'

type PortalStoreType = {
  apps: Record<string, ActionGroupType>
  setApps: (apps: Record<string, ActionGroupType>) => void

  connectedPortals: Array<PortalType>
  connectPortal: (portal?: PortalType) => void
  setConnectedPortals: (connectedPortals: []) => void
  getIsPortalConnected: (actionGroupId: string) => PortalType
  updateConnectedPortals: (actionGroupId: string, serviceId: string, parentNodeId: string) => void
}

const usePortalStore = create<PortalStoreType>(
  persist(
    (set, get) => ({
      apps: {},
      setApps: (apps) => set({ apps }),

      connectedPortals: [],
      setConnectedPortals: (connectedPortals) => set({ connectedPortals }),
      connectPortal: (portal) => {
        const connectedPortals = get().connectedPortals
        const newConnectedPortals = [...connectedPortals, portal]
        set({ connectedPortals: newConnectedPortals })
      },
      getIsPortalConnected: (actionGroupId: string) => {
        const connectedPortals = get().connectedPortals

        return connectedPortals.find((portal) => portal.serviceType === actionGroupId)
      },
      updateConnectedPortals: (actionGroupId, serviceId, parentNodeId) => {
        const connectedPortals = get().connectedPortals
        const newConnectedPortals = connectedPortals.map((portal) => {
          if (portal.serviceType === actionGroupId) {
            return { ...portal, serviceId, parentNodeId }
          }
          return portal
        })

        set({ connectedPortals: newConnectedPortals })
      }
    }),
    {
      name: 'mex-portal-store'
    }
  )
)

export default usePortalStore
