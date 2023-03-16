import { useEffect } from 'react'
import toast from 'react-hot-toast'

import { API, AppInitStatus, mog, runBatch, useAuthStore, useContentStore, useDataStore, useHighlightStore, usePromptStore, userPreferenceStore as useUserPreferenceStore,useSnippetStore  } from '@mexit/core'

import { useAuthentication } from '../Stores/useAuth'
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
import { useUserPreferences } from './useSyncUserPreferences'
import { useURLsAPI } from './useURLs'

export const useInitLoader = () => {
  const initalizeApp = useAuthStore((store) => store.appInitStatus)

  const setIsUserAuthenticated = useAuthStore((store) => store.setIsUserAuthenticated)

  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const snippetHydrated = useSnippetStore((store) => store._hasHydrated)
  const dataStoreHydrated = useDataStore((store) => store._hasHydrated)
  const contentStoreHydrated = useContentStore((store) => store._hasHydrated)
  const initHighlightBlockMap = useHighlightStore((store) => store.initHighlightBlockMap)
  const userPrefHydrated = useUserPreferenceStore((s) => s._hasHydrated)

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
  const { updateCurrentUserPreferences } = useUserPreferences()

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

    if (
      initalizeApp !== AppInitStatus.START &&
      userPrefHydrated &&
      snippetHydrated &&
      dataStoreHydrated &&
      contentStoreHydrated
    ) {
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
          await updateCurrentUserPreferences()

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
