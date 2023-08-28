import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import {
  API,
  AppInitStatus,
  BackupStorage,
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
  useStore,
  withTimeout
} from '@mexit/core'
import { useNodes } from '@mexit/shared'

import { useAuthentication } from '../Stores/useAuth'
import {
  getSearchIndexInitState,
  initSearchIndex,
  restoreSearchIndex,
  runBatchMessageTransformer,
  startRequestsWorkerService
} from '../Workers/controller'

import { useBroadcastAPI } from './API/useBroadcastAPI'
import { useCalendarAPI } from './API/useCalendarAPI'
import { useNamespaceApi } from './API/useNamespaceAPI'
import { useApi } from './API/useNodeAPI'
import { usePromptAPI } from './API/usePromptAPI'
import { useUserService } from './API/useUserAPI'
import { useViewAPI } from './API/useViewsAPI'
import { useFetchShareData } from './useFetchShareData'
import { useHighlightSync } from './useHighlights'
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
  const highlightStoreHydrated = useHighlightStore((store) => store._hasHydrated)
  const dataStoreHydrated = useDataStore((store) => store._hasHydrated)
  const contentStoreHydrated = useContentStore((store) => store._hasHydrated)
  const initHighlightBlockMap = useHighlightStore((store) => store.initHighlightBlockMap)
  const userPrefHydrated = useUserPreferenceStore((s) => s._hasHydrated)
  const linksStoreHydrated = useLinkStore((s) => s._hasHydrated)
  const setAppInitStatus = useAuthStore((store) => store.setAppInitStatus)
  const navigate = useNavigate()

  const { getAllPastEvents } = useBroadcastAPI()
  const { getAllSnippetsByWorkspace } = useApi()
  const { getAllNamespaces } = useNamespaceApi()
  const { getAllViews } = useViewAPI()
  const { getAllLinks } = useURLsAPI()
  const { updateBaseNode } = useNodes()
  const { restore, restoreFromS3 } = useStore()
  const { getAllWorkspaces } = useUserService()
  const { fetchAllHighlights } = useHighlightSync()
  const { logout } = useAuthentication()
  const { fetchShareData } = useFetchShareData()
  const { initPortals } = usePortals()
  const { getAllPrompts, getPromptProviders, getUserPromptAuth } = usePromptAPI()
  const { getCalendarProviders } = useCalendarAPI()
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
        getCalendarProviders(),
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

  const restoreIndex = async () => {
    const workspaceId = getWorkspaceId()

    const backup = await BackupStorage.getValue(workspaceId, 'mexit-search-index')
    if (backup) restoreSearchIndex(backup)
  }

  useEffect(() => {
    if (initalizeApp === AppInitStatus.SWITCH) {
      // restoreIndex()

      restore().then((res) => {
        const appInitStatus = res ? AppInitStatus.COMPLETE : AppInitStatus.RUNNING
        setAppInitStatus(appInitStatus)

        navigate('/', { replace: true })
      })
    }
  }, [initalizeApp])

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
          links: useLinkStore.getState().links ?? [],
          contents: useContentStore.getState().contents,
          highlights: useHighlightStore.getState().highlights ?? [],
          prompts: usePromptStore.getState().getAllPrompts()
        }

        promises.push(initSearchIndex(initData))
      }

      await Promise.allSettled(promises)
    }

    // TODO: I don't understand this particularly well
    if (
      initalizeApp !== AppInitStatus.START &&
      initalizeApp !== AppInitStatus.SWITCH &&
      userPrefHydrated &&
      snippetHydrated &&
      dataStoreHydrated &&
      contentStoreHydrated &&
      highlightStoreHydrated &&
      linksStoreHydrated
    ) {
      startWorkers()
        .then(async () => {
          await updateCurrentUserPreferences()
          await getAllWorkspaces()

          if (initalizeApp === AppInitStatus.RUNNING) {
            restoreFromS3()
              .then((res) => {
                if (res) {
                  getAllPastEvents(res).then((response) => {
                    runBatchMessageTransformer(response)
                  })
                }

                // TODO: can and should be done by a worker
                initHighlightBlockMap(useDataStore.getState().ilinks, useContentStore.getState().contents)
                updateBaseNode()
                setIsUserAuthenticated()

                setAppInitStatus(AppInitStatus.COMPLETE)
              })
              .catch(async (err) => {
                mog('error while restoring backup', { err })

                backgroundFetch()
                try {
                  await withTimeout(fetchAll(), 60 * 1000, 'Oops, something went wrong while fetching workspace')
                } catch (err) {
                  setManualReload(true)
                }
              })
          }
        })
        .catch((error) => {
          console.error('InitSearchIndexError', { error })
        })
    }
  }, [
    initalizeApp,
    linksStoreHydrated,
    highlightStoreHydrated,
    snippetHydrated,
    userPrefHydrated,
    dataStoreHydrated,
    contentStoreHydrated
  ])
}
