import { useEffect } from 'react'

import toast from 'react-hot-toast'

import { mog, runBatch } from '@mexit/core'

import { useAuthStore, useAuthentication } from '../Stores/useAuth'
import { useLayoutStore } from '../Stores/useLayoutStore'
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

  const { goTo } = useRouting()

  const { getNodesByWorkspace, getAllSnippetsByWorkspace, getAllNamespaces } = useApi()
  const { logout } = useAuthentication()
  const { fetchShareData } = useFetchShareData()
  const { initPortals } = usePortals()

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
      await getNodesByWorkspace()

      const baseNode = updateBaseNode()
      mog('Base Node: ', baseNode)
      loadNode(baseNode?.nodeid, { savePrev: false, fetch: false })
      goTo(ROUTE_PATHS.node, NavigationType.push, baseNode?.nodeid)

      setShowLoader(false)
    } catch (err) {
      console.log('Error in Init Loader: ', err)
      setShowLoader(false)
      logout()
      toast('Something went wrong while initializing')
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      mog('Inside InitLoader', { isAuthenticated })
      backgroundFetch()
      fetchAll()
    }
  }, [isAuthenticated])
}
