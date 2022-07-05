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
  share('theme', useThemeStore, { ref: 'share-theme' })
  share('ilinks', useDataStore, { ref: 'share-ilinks' })
  share('archive', useDataStore, { ref: 'share-archive' })
  share('sharedNodes', useDataStore, { ref: 'share-mentions' })
  share('contents', useContentStore, { ref: 'share-content' })
  share('authenticated', useAuthStore, { ref: 'share-auth' })
  share('isForgottenPassword', useAuthStore, { ref: 'share-forgottenPassword' })
  share('registered', useAuthStore, { ref: 'share-registered' })
  share('userDetails', useAuthStore, { ref: 'share-userDetails' })
  share('workspaceDetails', useAuthStore, { ref: 'share-workspaceDetails' })
  share('snippets', useSnippetStore, { ref: 'share-snippets' })
  share('reminders', useReminderStore, { ref: 'share-reminders' })
}

export default {}
