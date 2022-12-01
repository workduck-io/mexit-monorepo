import { BroadcastSyncedChannel } from '@mexit/core'

import { useAuthStore } from '../Hooks/useAuth'
import { useContentStore } from '../Stores/useContentStore'
import useDataStore from '../Stores/useDataStore'
import { useHighlightStore } from '../Stores/useHighlightStore'
import { useLinkStore } from '../Stores/useLinkStore'
import { useRecentsStore } from '../Stores/useRecentsStore'
import { useUserPreferenceStore } from '../Stores/userPreferenceStore'
import { useSmartCaptureStore } from '../Stores/useSmartCaptureStore'

const getStore = (channel: BroadcastSyncedChannel) => {
  switch (channel) {
    case BroadcastSyncedChannel.AUTH:
      return useAuthStore
    case BroadcastSyncedChannel.DATA:
      return useDataStore
    case BroadcastSyncedChannel.CONTENTS:
      return useContentStore
    case BroadcastSyncedChannel.HIGHLIGHTS:
      return useHighlightStore
    case BroadcastSyncedChannel.RECENTS:
      return useRecentsStore
    case BroadcastSyncedChannel.LINKS:
      return useLinkStore
    case BroadcastSyncedChannel.SMART_CAPTURE:
      return useSmartCaptureStore
    case BroadcastSyncedChannel.USER_PREFERENCES:
      return useUserPreferenceStore
    default:
      throw new Error(`${channel} doesn't exist in <Webapp-Extension> connector`)
  }
}

export default getStore
