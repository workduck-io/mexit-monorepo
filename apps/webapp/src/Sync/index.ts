import { useAuthStore as useDwindleAuthStore } from '@workduck-io/dwindle'

import {
  BroadcastSyncedChannel,
  useAuthStore,
  useCalendarStore,
  useContentStore,
  useDataStore,
  useDescriptionStore,
  useHighlightStore,
  useLinkStore,
  useMetadataStore,
  useRecentsStore,
  useReminderStore,
  userPreferenceStore as useUserPreferenceStore,
  useSmartCaptureStore,
  useSnippetStore
} from '@mexit/core'

import { syncStoreState } from './syncStore'

// This is required for event driven messaging, as the tabs or in our
// case a tab and a iframe don't know about their state updates, we
// create a channel for each other to inform of their changes
// progressive enhancement check.
const syncStores = () => {
  if ('BroadcastChannel' in globalThis /* || isSupported() */) {
    /*
     * Stores are synced by defining properties inside sync fields
     */

    syncStoreState(useDataStore, {
      name: BroadcastSyncedChannel.DATA,
      sync: [
        { field: 'ilinks' },
        { field: 'archive' },
        { field: 'bookmarks' },
        { field: 'namespaces' },
        { field: 'sharedNodes' },
        { field: 'tags' }
      ]
    })

    syncStoreState(useMetadataStore, { name: BroadcastSyncedChannel.METADATA, sync: [{ field: 'metadata' }] })

    syncStoreState(useContentStore, {
      name: BroadcastSyncedChannel.CONTENTS,
      sync: [{ field: 'contents' }]
    })

    syncStoreState(useDescriptionStore, {
      name: BroadcastSyncedChannel.DESCRIPTIONS,
      sync: [{ field: 'descriptions' }]
    })

    syncStoreState(useRecentsStore, {
      name: BroadcastSyncedChannel.RECENTS,
      sync: [{ field: 'lastOpened' }, { field: 'recentResearchNodes' }]
    })

    syncStoreState(useAuthStore, {
      name: BroadcastSyncedChannel.AUTH,
      sync: [{ field: 'authenticated' }, { field: 'userDetails' }, { field: 'workspaceDetails' }]
    })

    syncStoreState(useDescriptionStore, {
      name: BroadcastSyncedChannel.DESCRIPTIONS,
      sync: [{ field: 'descriptions' }]
    })

    syncStoreState(useSnippetStore, {
      name: BroadcastSyncedChannel.SNIPPETS,
      sync: [{ field: 'snippets' }]
    })

    syncStoreState(useSmartCaptureStore, {
      name: BroadcastSyncedChannel.SMART_CAPTURE,
      sync: [{ field: 'config' }]
    })

    syncStoreState(useReminderStore, {
      name: BroadcastSyncedChannel.REMINDERS,
      sync: [{ field: 'reminders' }, { field: 'armedReminders' }]
    })

    syncStoreState(useHighlightStore, {
      name: BroadcastSyncedChannel.HIGHLIGHTS,
      sync: [{ field: 'highlights' }, { field: 'highlightBlockMap' }]
    })

    syncStoreState(useDwindleAuthStore, {
      name: BroadcastSyncedChannel.DWINDLE,
      sync: [{ field: 'userCred' }, { field: 'userPool' }]
    })

    syncStoreState(useLinkStore, {
      name: BroadcastSyncedChannel.LINKS,
      sync: [{ field: 'links' }]
    })

    syncStoreState(useUserPreferenceStore, {
      name: BroadcastSyncedChannel.USER_PREFERENCES,
      sync: [{ field: 'theme' }]
    })

    syncStoreState(useCalendarStore, {
      name: BroadcastSyncedChannel.CALENDAR,
      sync: [{ field: 'tokens' }]
    })
  }
}

export default syncStores
