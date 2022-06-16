import {
  AddILinkProps,
  Contents,
  idxKey,
  ILink,
  NodeEditorContent,
  NodeMetadata,
  Snippet,
  UserDetails,
  WorkspaceDetails
} from '@mexit/core'
import { Theme } from '@mexit/shared'
import { AsyncMethodReturns, Methods } from 'penpal'
import toast from 'react-hot-toast'
import { useContentStore } from '../Stores/useContentStore'
import useDataStore from '../Stores/useDataStore'
import { useSnippetStore } from '../Stores/useSnippetStore'
import { useAuthStore } from './useAuth'
import useInternalAuthStore from './useAuthStore'
import useThemeStore from './useThemeStore'

interface ParentMethods {
  // ['SEARCH']: (key: idxKey | idxKey[], query: string) => Promise<any>
  ['SET_CONTENT']: [props: { nodeid: string; content: NodeEditorContent; metadata: NodeMetadata }]
  ['ADD_ILINK']: [props: AddILinkProps]
}

// Raju is great with doing Hera Pheri
// He doesn't carry out things on his own, but tells people what to do and when
// e.g. watch his scene when negotiating with taxi driver and construction worker to understand what useRaju does
export default function useRaju() {
  const setTheme = useThemeStore((store) => store.setTheme)
  const setAuthenticated = useAuthStore((store) => store.setAuthenticated)
  const setInternalAuthStore = useInternalAuthStore((store) => store.setAllStore)
  const initContents = useContentStore((store) => store.initContents)
  const setIlinks = useDataStore((store) => store.setIlinks)
  const initSnippets = useSnippetStore((store) => store.initSnippets)

  const methods: Methods = {
    init(
      userDetails: UserDetails,
      workspaceDetails: WorkspaceDetails,
      theme: Theme,
      authAWS: any,
      snippets: Snippet[],
      contents: Contents,
      ilinks: any[]
    ) {
      setAuthenticated(userDetails, workspaceDetails)
      setTheme(theme)
      setInternalAuthStore(authAWS)
      initSnippets(snippets)
      setIlinks(ilinks)
      initContents(contents)
    },
    success(message: string) {
      toast.success(message)
    },
    error(message: string) {
      toast.error(message)
    }
  }

  const dispatch = <K extends keyof ParentMethods>(type: K, ...params: ParentMethods[K]) => {
    let event = new CustomEvent('raju', { detail: { type, ...params } })

    window.dispatchEvent(event)
  }

  return {
    methods,
    dispatch
  }
}