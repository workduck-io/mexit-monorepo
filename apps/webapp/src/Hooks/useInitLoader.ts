import { useEffect } from 'react'
import toast from 'react-hot-toast'

import { API, AppInitStatus, mog, runBatch } from '@mexit/core'

import { useAuthentication, useAuthStore } from '../Stores/useAuth'
import { useContentStore } from '../Stores/useContentStore'
import { useDataStore } from '../Stores/useDataStore'
import { useHighlightStore } from '../Stores/useHighlightStore'
import { usePromptStore } from '../Stores/usePromptStore'
import { useSnippetStore } from '../Stores/useSnippetStore'
import { initSearchIndex, startRequestsWorkerService } from '../Workers/controller'

import { useNamespaceApi } from './API/useNamespaceAPI'
import { useApi } from './API/useNodeAPI'
import { usePromptAPI } from './API/usePromptAPI'
import { useViewAPI } from './API/useViewsAPI'
import { useFetchShareData } from './useFetchShareData'
import { useHighlightSync } from './useHighlights'
import { useNodes } from './useNodes'
import { usePortals } from './usePortals'
import { useSmartCapture } from './useSmartCapture'
import { useURLsAPI } from './useURLs'

export const useInitLoader = () => {
  const initalizeApp = useAuthStore((store) => store.appInitStatus)

  const setIsUserAuthenticated = useAuthStore((store) => store.setIsUserAuthenticated)

  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const snippetHydrated = useSnippetStore((store) => store._hasHydrated)
  const dataStoreHydrated = useDataStore((store) => store._hasHydrated)
  const contentStoreHydrated = useContentStore((store) => store._hasHydrated)
  const initHighlightBlockMap = useHighlightStore((store) => store.initHighlightBlockMap)

  const { getAllSnippetsByWorkspace } = useApi()
  const { getAllNamespaces } = useNamespaceApi()
  const { getAllViews } = useViewAPI()
  const { getAllLinks } = useURLsAPI()
  const { updateBaseNode } = useNodes()
  const { fetchAllHighlights } = useHighlightSync()
  const { logout } = useAuthentication()
  const { fetchShareData } = useFetchShareData()
  const { initPortals } = usePortals()
  const { getAllPrompts, getPromptProviders, getUserPromptAuth } = usePromptAPI()
  const { getAllSmartCaptures } = useSmartCapture()

  const backgroundFetch = async () => {
    try {
      runBatch<any>([
        fetchShareData(),
        initPortals(),
        getAllViews(),
        getAllLinks(),
        getAllSmartCaptures(),
        fetchAllHighlights(),
        getAllPrompts(),
        getPromptProviders(),
        getUserPromptAuth()
      ])
    } catch (err) {
      mog('Background fetch failed')
    }
  }

  const fetchAll = async () => {
    try {
      await getAllNamespaces()
      await getAllSnippetsByWorkspace()
      // await getNodesByWorkspace()

      // TODO: can and should be done by a worker
      initHighlightBlockMap(useDataStore.getState().ilinks, useContentStore.getState().contents)

      updateBaseNode()

      if (useAuthStore.getState().appInitStatus === AppInitStatus.RUNNING) setIsUserAuthenticated()
    } catch (err) {
      console.error('Error in Init Loader: ', err)
      logout()
      toast('Something went wrong while initializing')
    }
  }

  useEffect(() => {
    API.setWorkspaceHeader(getWorkspaceId())

    if (initalizeApp !== AppInitStatus.START && snippetHydrated && dataStoreHydrated && contentStoreHydrated) {
      const initData = {
        ilinks: useDataStore.getState().ilinks,
        archive: useDataStore.getState().archive,
        sharedNodes: useDataStore.getState().sharedNodes,
        snippets: useSnippetStore.getState().snippets,
        contents: useContentStore.getState().contents,
        prompts: usePromptStore.getState().getAllPrompts()
      }

      initSearchIndex(initData)
        .then(async () => {
          await startRequestsWorkerService()

          if (initalizeApp === AppInitStatus.RUNNING) {
            backgroundFetch()
            await fetchAll()
          }
        })
        .catch((error) => {
          console.error('InitSearchIndexError', { error })
        })
    }
  }, [initalizeApp, snippetHydrated, dataStoreHydrated, contentStoreHydrated])
}
