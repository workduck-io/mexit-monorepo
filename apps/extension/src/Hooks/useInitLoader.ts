import { useEffect } from 'react'

import {
  mog,
  useAuthStore,
  useContentStore,
  useDataStore,
  useHighlightStore,
  useInitStore,
  useLinkStore,
  useSnippetStore,
  useTimestampStore
} from '@mexit/core'

import {
  getSearchIndexInitState,
  initSearchIndex,
  runBatchMessageTransformer,
  startRequestsWorkerService
} from '../Sync/invokeOnWorker'

import { useBroadcastAPI } from './useBroadcastAPI'

export const useInitLoader = () => {
  const isAuthenticated = useAuthStore((store) => store.authenticated)
  const iframeAdded = useInitStore((store) => store.iframeAdded)
  //   const initHighlightBlockMap = useHighlightStore((store) => store.initHighlightBlockMap)

  const snippetHydrated = useSnippetStore((store) => store._hasHydrated)
  const dataStoreHydrated = useDataStore((store) => store._hasHydrated)
  const contentStoreHydrated = useContentStore((store) => store._hasHydrated)
  const linksStoreHydrated = useLinkStore((s) => s._hasHydrated)
  const highlightStoreHydrated = useHighlightStore((store) => store._hasHydrated)

  const { getAllPastEvents } = useBroadcastAPI()

  const startWorkers = async () => {
    mog('Starting Workers')
    const promises = [startRequestsWorkerService()]
    const searchIndexInitState = await getSearchIndexInitState()
    if (!searchIndexInitState) {
      const initData = {
        ilinks: useDataStore.getState().ilinks,
        archive: useDataStore.getState().archive,
        links: useLinkStore.getState().links ?? [],
        highlights: useHighlightStore.getState().highlights,
        sharedNodes: useDataStore.getState().sharedNodes,
        snippets: useSnippetStore.getState().snippets,
        contents: useContentStore.getState().contents
      }
      mog('Search Worker was not initialized. Initializing', { initData })

      promises.push(initSearchIndex(initData))
    }

    await Promise.allSettled(promises)
  }

  useEffect(() => {
    if (
      isAuthenticated &&
      snippetHydrated &&
      dataStoreHydrated &&
      contentStoreHydrated &&
      linksStoreHydrated &&
      highlightStoreHydrated &&
      iframeAdded
    ) {
      startWorkers()
        .then(() => {
          mog('All workers initialized from extension. Comparing backup timestamp now')
          // fetchAll()
          const lastFetchedTimestamp = useTimestampStore.getState()?.timestamp
          if (lastFetchedTimestamp) {
            getAllPastEvents(lastFetchedTimestamp).then(({ message, error }) => {
              if (!error) {
                runBatchMessageTransformer(message)
              }
            })
          }
        })
        .catch((error) => {
          mog('Error while initializing: ', { error })
        })
    }
  }, [
    snippetHydrated,
    dataStoreHydrated,
    highlightStoreHydrated,
    linksStoreHydrated,
    contentStoreHydrated,
    iframeAdded
  ])
}
