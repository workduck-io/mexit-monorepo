import { useEffect } from 'react'
import toast from 'react-hot-toast'

import { API, mog, runBatch } from '@mexit/core'

import { useAuthentication, useAuthStore } from '../Stores/useAuth'
import { useContentStore } from '../Stores/useContentStore'
import { useDataStore } from '../Stores/useDataStore'
import { useHighlightStore } from '../Stores/useHighlightStore'
import { useLayoutStore } from '../Stores/useLayoutStore'
import { useSnippetStore } from '../Stores/useSnippetStore'
import { initSearchIndex, startRequestsWorkerService } from '../Workers/controller'

import { useNamespaceApi } from './API/useNamespaceAPI'
import { useApi } from './API/useNodeAPI'
import { useViewAPI } from './API/useViewsAPI'
import { useFetchShareData } from './useFetchShareData'
import { useHighlightSync } from './useHighlights'
import { useNodes } from './useNodes'
import { usePortals } from './usePortals'
import { useSmartCapture } from './useSmartCapture'
import { useURLsAPI } from './useURLs'

export const useInitLoader = () => {
  const isAuthenticated = useAuthStore((store) => store.authenticated)
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const setShowLoader = useLayoutStore((store) => store.setShowLoader)
  const { updateBaseNode } = useNodes()
  const initHighlightBlockMap = useHighlightStore((store) => store.initHighlightBlockMap)

  const { getAllSnippetsByWorkspace } = useApi()
  const { getAllNamespaces } = useNamespaceApi()
  const { getAllViews } = useViewAPI()
  const { getAllLinks } = useURLsAPI()
  const { fetchAllHighlights } = useHighlightSync()
  const { logout } = useAuthentication()
  const { fetchShareData } = useFetchShareData()
  const { initPortals } = usePortals()
  const { getAllSmartCaptures } = useSmartCapture()
  const snippetHydrated = useSnippetStore((store) => store._hasHydrated)
  const dataStoreHydrated = useDataStore((store) => store._hasHydrated)
  const contentStoreHydrated = useContentStore((store) => store._hasHydrated)

  const backgroundFetch = async () => {
    try {
      runBatch<any>([
        fetchShareData(),
        initPortals(),
        getAllSnippetsByWorkspace(),
        getAllViews(),
        getAllLinks(),
        getAllSmartCaptures(),
        fetchAllHighlights()
      ])
    } catch (err) {
      mog('Background fetch failed')
    }
  }

  const fetchAll = async () => {
    try {
      await getAllNamespaces()
      // await getNodesByWorkspace()

      // TODO: can and should be done by a worker
      initHighlightBlockMap(useDataStore.getState().ilinks, useContentStore.getState().contents)

      updateBaseNode()
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
    if (isAuthenticated && snippetHydrated && dataStoreHydrated && contentStoreHydrated) {
      API.setWorkspaceHeader(getWorkspaceId())

      const initData = {
        ilinks: useDataStore.getState().ilinks,
        archive: useDataStore.getState().archive,
        sharedNodes: useDataStore.getState().sharedNodes,
        snippets: useSnippetStore.getState().snippets,
        contents: useContentStore.getState().contents
      }

      initSearchIndex(initData)
        .then(async () => {
          await startRequestsWorkerService()
          backgroundFetch()
          fetchAll()
        })
        .catch((error) => {
          console.log('InitSearchIndexError', { error })
        })
    }
  }, [isAuthenticated, snippetHydrated, dataStoreHydrated, contentStoreHydrated])
}
