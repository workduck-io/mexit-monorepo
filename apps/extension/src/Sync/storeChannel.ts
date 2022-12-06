import { BroadcastSyncedChannel } from '@mexit/core'

import { useAuthStore } from '../Hooks/useAuth'
import useInternalAuthStore from '../Hooks/useAuthStore'
import { useContentStore } from '../Stores/useContentStore'
import useDataStore from '../Stores/useDataStore'
import { useDescriptionStore } from '../Stores/useDescriptionStore'
import { useHighlightStore } from '../Stores/useHighlightStore'
import { useLayoutStore } from '../Stores/useLayoutStore'
import { useLinkStore } from '../Stores/useLinkStore'
import { useRecentsStore } from '../Stores/useRecentsStore'
import { useUserPreferenceStore } from '../Stores/userPreferenceStore'
import { useSmartCaptureStore } from '../Stores/useSmartCaptureStore'
import { useSnippetStore } from '../Stores/useSnippetStore'

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
    case BroadcastSyncedChannel.LAYOUT:
      return useLayoutStore
    case BroadcastSyncedChannel.DWINDLE:
      return useInternalAuthStore
    case BroadcastSyncedChannel.RECENTS:
      return useRecentsStore
    case BroadcastSyncedChannel.DESCRIPTIONS:
      return useDescriptionStore
    case BroadcastSyncedChannel.SNIPPETS:
      return useSnippetStore
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
