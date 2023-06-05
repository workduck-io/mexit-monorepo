import {
  BroadcastSyncedChannel,
  useAuthStore,
  useCalendarStore,
  useContentStore,
  useDataStore,
  useDescriptionStore,
  useHighlightStore,
  useLayoutStore,
  useLinkStore,
  useMetadataStore,
  useRecentsStore,
  userPreferenceStore as useUserPreferenceStore,
  useSmartCaptureStore,
  useSnippetStore
} from '@mexit/core'

import useInternalAuthStore from '../Hooks/useAuthStore'

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
    case BroadcastSyncedChannel.METADATA:
      return useMetadataStore
    case BroadcastSyncedChannel.LINKS:
      return useLinkStore
    case BroadcastSyncedChannel.CALENDAR:
      return useCalendarStore
    case BroadcastSyncedChannel.SMART_CAPTURE:
      return useSmartCaptureStore
    case BroadcastSyncedChannel.USER_PREFERENCES:
      return useUserPreferenceStore
    default:
      throw new Error(`${channel} doesn't exist in <Webapp-Extension> connector`)
  }
}

export default getStore
