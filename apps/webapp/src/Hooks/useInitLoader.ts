import { useEffect } from 'react'

import toast from 'react-hot-toast'

import { mog, runBatch } from '@mexit/core'

import { useAuthStore, useAuthentication } from '../Stores/useAuth'
import { useContentStore } from '../Stores/useContentStore'
import { useDataStore } from '../Stores/useDataStore'
import { useHighlightStore } from '../Stores/useHighlightStore'
import { useLayoutStore } from '../Stores/useLayoutStore'
import { useSnippetStore } from '../Stores/useSnippetStore'
import { useNamespaceApi } from './API/useNamespaceAPI'
import { useApi } from './API/useNodeAPI'
import { useFetchShareData } from './useFetchShareData'
import useLoad from './useLoad'
import { useNodes } from './useNodes'
import { usePortals } from './usePortals'
import { useRouting, ROUTE_PATHS, NavigationType } from './useRouting'

export const useInitLoader = () => {
  const isAuthenticated = useAuthStore((store) => store.authenticated)
  const setShowLoader = useLayoutStore((store) => store.setShowLoader)
  const { loadNode } = useLoad()
  const { updateBaseNode } = useNodes()
  const initHighlights = useHighlightStore((store) => store.initHighlights)

  const { goTo } = useRouting()

  const { getAllSnippetsByWorkspace } = useApi()
  const { getAllNamespaces } = useNamespaceApi()
  // const { logout } = useAuthentication()
  const { fetchShareData } = useFetchShareData()
  const { initPortals } = usePortals()

  const snippetHydrated = useSnippetStore((store) => store._hasHydrated)

  const backgroundFetch = async () => {
    try {
      runBatch<any>([fetchShareData(), initPortals(), getAllSnippetsByWorkspace()])
    } catch (err) {
      mog('Background fetch failed')
    }
  }

  const fetchAll = async () => {
    setShowLoader(true)
    try {
      await getAllNamespaces()
      // await getNodesByWorkspace()

      // TODO: can and should be done by a worker
      initHighlights(useDataStore.getState().ilinks, useContentStore.getState().contents)

      const baseNode = updateBaseNode()
      // mog('Base Node: ', baseNode)

      // TODO: I will come back to this
      if (
        window.location.pathname !== '/chotu' &&
        !window.location.pathname.startsWith(ROUTE_PATHS.actions) &&
        !window.location.pathname.startsWith(ROUTE_PATHS.share) &&
        !window.location.pathname.startsWith(ROUTE_PATHS.integrations)
      ) {
        mog('Base Node: ', baseNode)
        loadNode(baseNode?.nodeid, { savePrev: false, fetch: false })
        goTo(ROUTE_PATHS.node, NavigationType.push, baseNode?.nodeid)
      }

      setShowLoader(false)
    } catch (err) {
      console.error('Error in Init Loader: ', err)
      setShowLoader(false)
      // logout()
      toast('Something went wrong while initializing')
    }
  }

  useEffect(() => {
    if (isAuthenticated && snippetHydrated) {
      mog('Inside InitLoader', { isAuthenticated })
      backgroundFetch()
      fetchAll()
    }
  }, [isAuthenticated, snippetHydrated])
}
