import { IS_DEV } from '@mexit/core'
import { mountStoreDevtool } from 'simple-zustand-devtools'

import { useAnalysisStore } from './useAnalysis'
import { useAuthStore } from './useAuth'
import useContentStore from './useContentStore'
import useDataStore from './useDataStore'
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

export default {}
