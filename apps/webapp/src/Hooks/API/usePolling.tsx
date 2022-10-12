import { mog } from '@mexit/core'
import { useIntervalWithTimeout } from '@mexit/shared'

import { PollActions, useApiStore } from '../../Stores/useApiStore'
import { useAuthStore } from '../../Stores/useAuth'
import { useBookmarks } from '../useBookmarks'
import { useFetchShareData } from '../useFetchShareData'
import { useApi } from './useNodeAPI'

export const PollingInterval = {
  [PollActions.shared]: 5 * 60 * 1000, // 5 minutes
  [PollActions.hierarchy]: 5 * 60 * 1000, // 5 minutes
  [PollActions.bookmarks]: 30 * 60 * 1000 // 30 minutes
}

export const usePolling = () => {
  const polling = useApiStore((store) => store.polling)
  const isAuthenticated = useAuthStore((store) => store.authenticated)

  const { getNodesByWorkspace } = useApi()
  const { getAllBookmarks } = useBookmarks()
  const { fetchShareData } = useFetchShareData()

  useIntervalWithTimeout(
    () => {
      fetchShareData().then(() => mog('Successfully fetched shared nodes'))
    },
    isAuthenticated && polling.has(PollActions.shared) ? PollingInterval[PollActions.shared] : null
  )

  useIntervalWithTimeout(
    () => {
      getAllBookmarks().then(() => mog('Successfully fetched bookmarks'))
    },
    isAuthenticated && polling.has(PollActions.bookmarks) ? PollingInterval[PollActions.bookmarks] : null
  )

  useIntervalWithTimeout(
    () => {
      getNodesByWorkspace().then(() => mog('Successfully fetched hierarchy'))
      // refreshILinks().then(() => mog('Successfully fetched hierarchy'))
    },
    isAuthenticated && polling.has(PollActions.hierarchy) ? PollingInterval[PollActions.hierarchy] : null
  )
}
