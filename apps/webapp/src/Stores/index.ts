import { mountStoreDevtool } from 'simple-zustand-devtools'
import { share, isSupported } from 'shared-zustand'

import { IS_DEV } from '@mexit/core'

import { useAnalysisStore } from './useAnalysis'
import useContentStore from './useContentStore'
import useDataStore from './useDataStore'
import { useAuthStore } from './useAuth'
import useEditorStore from './useEditorStore'
import { useRecentsStore } from './useRecentsStore'
import { useSnippetStore } from './useSnippetStore'
import useThemeStore from './useThemeStore'
import useTodoStore from './useTodoStore'
import { useRefactorStore } from './useRefactorStore'
import { useHistoryStore } from './useHistoryStore'

if (IS_DEV) {
  console.log('Zustand Devtools Initialize')
  mountStoreDevtool('useAuthStore', useAuthStore)
  mountStoreDevtool('useAnalysisStore', useAnalysisStore)
  mountStoreDevtool('useContentStore', useContentStore)
  mountStoreDevtool('useDataStore', useDataStore)
  mountStoreDevtool('useEditorStore', useEditorStore)
  mountStoreDevtool('useRecentsStore', useRecentsStore)
  mountStoreDevtool('useThemeStore', useThemeStore)
  mountStoreDevtool('useTodoStore', useTodoStore)
  mountStoreDevtool('useRefactorStore', useRefactorStore)
  mountStoreDevtool('useHistoryStore', useHistoryStore)
  mountStoreDevtool('useSnippetStore', useSnippetStore)
}

// This is required for event driven messaging, as the tabs or in our
// case a tab and a iframe don't know about their state updates, we
// create a channel for each other to inform of their changes
// progressive enhancement check.
if ('BroadcastChannel' in globalThis /* || isSupported() */) {
  // share the property "count" of the state with other tabs
  share('theme', useThemeStore)
  share('ilinks', useDataStore)
  // share('archive', useDataStore)
  share('contents', useContentStore)
  // share('authenticated', useAuthStore)
  // share('snippets', useSnippetStore)
}

export default {}
