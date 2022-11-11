import { produce } from 'immer'
import create from 'zustand'
import { devtools } from 'zustand/middleware'

import { mog } from '@mexit/core'

type Route = string

type RouteInformation = {
  users: Array<string>
  banners?: Array<BannerType>
}

export enum BannerType {
  editor = 'editor-banner',
  release = 'release-banner'
}

type RouteStoreType = {
  routes: Record<Route, RouteInformation>
  setRoute: (routes: Record<Route, RouteInformation>) => void
  addRouteInfo: (route: Route, info: RouteInformation) => void
  addUserInRoute: (route: Route, userId: string) => void
  removeUserFromRoute: (route: Route, userId: string) => void
  getIsBannerVisible: (route: Route, banner: BannerType) => boolean
  showBannerInRoute: (route: Route, banner: BannerType) => void
  removePreviousRouteInfo: () => void
  removeRouteInfo: (route: Route) => void
}

const useRouteStore = create<RouteStoreType>(
  devtools(
    (set, get) => ({
      routes: {},
      setRoute: (routes) => set({ routes }),
      addRouteInfo: (route, info) => {
        set(
          produce((draft) => {
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
      addUserInRoute: (route, userId) => {
        const routes = get().routes

        if (routes[route]) {
          const users = routes[route].users
          const banners = routes[route].banners
          set(
            produce((draft) => {
              draft.routes[route]['users'] = [...users, userId]
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
              draft.routes[route] = routeInfo
            })
          )
        }
      },
      removeUserFromRoute: (route, userId) => {
        const routes = get().routes

        if (routes[route]) {
          const users = routes[route].users
          const banners = routes[route].banners
          const userToRemoveAtIndex = users.findIndex((id) => id === userId)

          if (userToRemoveAtIndex >= 0) {
            const newBanners =
              users.length > 0 ? [...banners, BannerType.editor] : banners.filter((f) => f !== BannerType.editor)
            set(
              produce((draft) => {
                draft.routes[route].users.splice(userToRemoveAtIndex, 1)
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
    }),
    {
      name: 'Route Store '
    }
  )
)

export default useRouteStore
