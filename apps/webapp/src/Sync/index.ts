import { useAuthStore as useDwindleAuthStore } from '@workduck-io/dwindle'

import { BroadcastSyncedChannel } from '@mexit/core'

import { useAuthStore } from '../Stores/useAuth'
import { useContentStore } from '../Stores/useContentStore'
import { useDataStore } from '../Stores/useDataStore'
import { useDescriptionStore } from '../Stores/useDescriptionStore'
import { useHighlightStore } from '../Stores/useHighlightStore'
import { useRecentsStore } from '../Stores/useRecentsStore'
import { useReminderStore } from '../Stores/useReminderStore'
import { useUserPreferenceStore } from '../Stores/userPreferenceStore'
import { useSnippetStore } from '../Stores/useSnippetStore'

import { syncStoreState } from './synced'

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
        { field: 'tags' },
        { field: 'publicNodes' }
      ]
    })

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

    syncStoreState(useReminderStore, {
      name: BroadcastSyncedChannel.REMINDERS,
      sync: [{ field: 'reminders' }]
    })

    syncStoreState(useHighlightStore, {
      name: BroadcastSyncedChannel.HIGHLIGHTS,
      sync: [{ field: 'highlights' }, { field: 'highlightBlockMap' }]
    })

    syncStoreState(useDwindleAuthStore, {
      name: BroadcastSyncedChannel.DWINDLE,
      sync: [{ field: 'userCred' }, { field: 'userPool' }]
    })

    syncStoreState(useUserPreferenceStore, {
      name: BroadcastSyncedChannel.USER_PREFERENCES,
      sync: [{ field: 'theme' }]
    })
  }
}

export default syncStores
