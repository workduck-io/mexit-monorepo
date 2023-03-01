import { produce } from 'immer'

import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

type Route = string

type RouteInformation = {
  users: Array<string>
  banners?: Array<BannerType>
}

export enum BannerType {
  editor = 'editor-banner',
  release = 'release-banner'
}

const routeStoreConfig = (set, get) => ({
  routes: {},
  setRoute: (routes) => set({ routes }),
  addRouteInfo: (route, info) => {
    set(
      produce((draft) => {
        // eslint-disable-next-line
        // @ts-ignore
        draft.routes[route] = info
      })
    )
  },
  removePreviousRouteInfo: () => {
    const routes = get().routes
    const lastKey = Object.keys(routes).at(-1)
    if (lastKey) delete routes[lastKey]
    set({ routes })
  },
  getIsBannerVisible: (route, banner) => {
    const routes = get().routes
    const banners = routes?.[route]?.banners

    return banners?.includes(banner)
  },
  clear: () => set({ routes: {} }),
  addUserInRoute: (route, userId) => {
    const routes = get().routes

    if (routes[route]) {
      const users = routes[route].users
      const banners = routes[route].banners
      set(
        produce((draft) => {
          // eslint-disable-next-line
          // @ts-ignore
          draft.routes[route]['users'] = [...users, userId]
          // eslint-disable-next-line
          // @ts-ignore
          draft.routes[route]['banners'] = [...banners.filter((f) => f !== BannerType.editor), BannerType.editor]
        })
      )
    } else {
      const routeInfo: RouteInformation = {
        users: [userId],
        banners: [BannerType.editor]
      }

      set(
        produce((draft) => {
          // eslint-disable-next-line
          // @ts-ignore
          draft.routes[route] = routeInfo
        })
      )
    }
  },
  removeUserFromRoute: (route, userId) => {
    const routes = get().routes

    if (routes[route]) {
      const users = routes[route].users
      const banners = routes[route].banners?.filter((f) => f !== BannerType.editor) ?? []
      const userToRemoveAtIndex = users?.findIndex((id) => id === userId)

      if (userToRemoveAtIndex >= 0) {
        const newUsers = users.filter((user, i) => i !== userToRemoveAtIndex)
        const newBanners = newUsers.length > 0 ? [...banners, BannerType.editor] : banners

        set(
          produce((draft) => {
            // eslint-disable-next-line
            // @ts-ignore
            draft.routes[route].users = newUsers
            // eslint-disable-next-line
            // @ts-ignore
            draft.routes[route].banners = newBanners
          })
        )
      }
    }
  },
  showBannerInRoute: (route, banner) => {
    const routes = get().routes

    if (routes[route]) {
      const routeInfo = routes[route]
      set({ routes: { ...routes, [route]: { ...routeInfo, banners: [...routeInfo.banners, banner] } } })
    } else {
      const routeInfo: RouteInformation = { users: [], banners: [BannerType.editor] }
      set({ routes: { ...routes, [route]: routeInfo } })
    }
  },
  removeRouteInfo: (route) => {
    const routes = get().routes

    if (routes[route]) {
      delete routes[route]
      set({ routes })
    }
  }
})

export const useRouteStore = createStore(routeStoreConfig, StoreIdentifier.ROUTE, false)