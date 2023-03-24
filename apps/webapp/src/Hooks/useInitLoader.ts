import { useEffect } from 'react'
import toast from 'react-hot-toast'

import {
  API,
  AppInitStatus,
  mog,
  runBatch,
  useAppStore,
  useAuthStore,
  useContentStore,
  useDataStore,
  useHighlightStore,
  useLinkStore,
  usePromptStore,
  userPreferenceStore as useUserPreferenceStore,
  useSnippetStore,
  withTimeout
} from '@mexit/core'

import { useAuthentication } from '../Stores/useAuth'
import { getSearchIndexInitState, initSearchIndex, startRequestsWorkerService } from '../Workers/controller'

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
  const setManualReload = useAppStore((store) => store.setManualReload)
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

    const startWorkers = async () => {
      const searchIndexInitState = await getSearchIndexInitState()
      const promises = [startRequestsWorkerService()]
      if (!searchIndexInitState) {
        const initData = {
          ilinks: useDataStore.getState().ilinks,
          archive: useDataStore.getState().archive,
          sharedNodes: useDataStore.getState().sharedNodes,
          snippets: useSnippetStore.getState().snippets,
          links: useLinkStore.getState().links,
          contents: useContentStore.getState().contents,
          highlights: useHighlightStore.getState().highlights,
          prompts: usePromptStore.getState().getAllPrompts()
        }

        promises.push(initSearchIndex(initData))
      }

      await Promise.allSettled(promises)
    }

    if (
      initalizeApp !== AppInitStatus.START &&
      userPrefHydrated &&
      snippetHydrated &&
      dataStoreHydrated &&
      contentStoreHydrated
    ) {
      startWorkers()
        .then(async () => {
          await updateCurrentUserPreferences()

          if (initalizeApp === AppInitStatus.RUNNING) {
            backgroundFetch()
            try {
              await withTimeout(fetchAll(), 60 * 1000, 'Oops, something went wrong while fetching workspace')
            } catch (err) {
              setManualReload(true)
            }
          }
        })
        .catch((error) => {
          console.error('InitSearchIndexError', { error })
        })
    }
  }, [initalizeApp, snippetHydrated, dataStoreHydrated, contentStoreHydrated])
}
