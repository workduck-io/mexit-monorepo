import { useEffect } from 'react'

import toast from 'react-hot-toast'

import { mog, runBatch } from '@mexit/core'

import { useAuthentication, useAuthStore } from '../Stores/useAuth'
import { useContentStore } from '../Stores/useContentStore'
import { useDataStore } from '../Stores/useDataStore'
import { useHighlightStore } from '../Stores/useHighlightStore'
import { useLayoutStore } from '../Stores/useLayoutStore'
import { useSnippetStore } from '../Stores/useSnippetStore'
import { useNamespaceApi } from './API/useNamespaceAPI'
import { useApi } from './API/useNodeAPI'
import { useViewAPI } from './API/useViewsAPI'
import { useFetchShareData } from './useFetchShareData'
import useLoad from './useLoad'
import { useNodes } from './useNodes'
import { usePortals } from './usePortals'
import { useRouting } from './useRouting'
import { useURLsAPI } from './useURLs'

export const useInitLoader = () => {
  const isAuthenticated = useAuthStore((store) => store.authenticated)
  const setShowLoader = useLayoutStore((store) => store.setShowLoader)
  const { loadNode } = useLoad()
  const { updateBaseNode } = useNodes()
  const initHighlights = useHighlightStore((store) => store.initHighlights)

  const { goTo } = useRouting()

  const { getAllSnippetsByWorkspace } = useApi()
  const { getAllNamespaces } = useNamespaceApi()
  const { getAllViews } = useViewAPI()
  const { getAllLinks } = useURLsAPI()
  const { logout } = useAuthentication()
  const { fetchShareData } = useFetchShareData()
  const { initPortals } = usePortals()

  const snippetHydrated = useSnippetStore((store) => store._hasHydrated)
  const dataStoreHydrated = useDataStore((store) => store._hasHydrated)

  const backgroundFetch = async () => {
    try {
      runBatch<any>([fetchShareData(), initPortals(), getAllSnippetsByWorkspace(), getAllViews(), getAllLinks()])
    } catch (err) {
      mog('Background fetch failed')
    }
  }

  const fetchAll = async () => {
    try {
      await getAllNamespaces()
      // await getNodesByWorkspace()

      // TODO: can and should be done by a worker
      initHighlights(useDataStore.getState().ilinks, useContentStore.getState().contents)

      const baseNode = updateBaseNode()

      // We only set showLoader to false here because when needed the loader would be made visible by another component
      setShowLoader(false)
    } catch (err) {
      console.error('Error in Init Loader: ', err)
      setShowLoader(false)
      logout()
      toast('Something went wrong while initializing')
    }
  }

  useEffect(() => {
    if (isAuthenticated && snippetHydrated && dataStoreHydrated) {
      mog('Inside InitLoader', { isAuthenticated })
      backgroundFetch()
      fetchAll()
    }
  }, [isAuthenticated, snippetHydrated, dataStoreHydrated])
}
