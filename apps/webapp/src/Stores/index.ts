import { share } from 'shared-zustand'

import { useAuthStore } from './useAuth'
import useThemeStore from './useThemeStore'
import { useContentStore } from './useContentStore'
import { useDataStore } from './useDataStore'
import { useSnippetStore } from './useSnippetStore'
import { useReminderStore } from './useReminderStore'
import { nanoid } from 'nanoid'

// This is required for event driven messaging, as the tabs or in our
// case a tab and a iframe don't know about their state updates, we
// create a channel for each other to inform of their changes
// progressive enhancement check.
if ('BroadcastChannel' in globalThis /* || isSupported() */) {
  // share the property "count" of the state with other tabs
  share('theme', useThemeStore, { initialize: true, ref: 'share-theme' })
  share('ilinks', useDataStore, { initialize: true, ref: 'share-ilinks' })
  share('archive', useDataStore, { initialize: true, ref: 'share-archive' })
  share('contents', useContentStore, { initialize: true, ref: 'share-content' })
  share('authenticated', useAuthStore, { initialize: true, ref: 'share-auth' })
  share('snippets', useSnippetStore, { initialize: true, ref: 'share-snippets' })
  share('reminders', useReminderStore, { initialize: true, ref: 'share-reminders' })
}

export default {}
