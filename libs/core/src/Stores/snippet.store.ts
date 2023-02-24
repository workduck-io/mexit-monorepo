import { NodeEditorContent } from '../Types/Editor'
import { MIcon, StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

export interface Snippet {
  id: string
  title: string
  icon?: MIcon
  content?: NodeEditorContent
  template?: boolean
}

export interface SnippetEditorStore {
  snippet?: Snippet
}

export type SnippetID = string
export type Snippets = Record<SnippetID, Snippet>

export const snippetStoreConfig = (set, get) => ({
  snippets: {} as Snippets,

  initSnippets: (snippets: Snippets) =>
    set({
      snippets
    }),

  addSnippet: (snippet: Snippet) => {
    const existingSnippets = get().snippets
    set({ snippets: { ...existingSnippets, [snippet.id]: snippet } })
  },

  updateSnippet: (id: string, snippet: Snippet) => {
    const existingSnippets = get().snippets
    set({ snippets: { ...existingSnippets, [snippet.id]: snippet } })
  },

  updateSnippetContent: (id: string, content: any[], isTemplate?: boolean) => {
    const snippets = get().snippets
    set({ snippets: { ...snippets, [id]: { ...(snippets[id] ?? {}), content, isTemplate } } })
  },

  updateSnippetContentAndTitle: (id: string, content: any[], title: string, isTemplate?: boolean) => {
    const snippets = get().snippets
    set({ snippets: { ...snippets, [id]: { ...(snippets[id] ?? {}), content, title, isTemplate } } })
  },

  clear: () => {
    set({ snippets: {}, editor: { snippet: undefined } })
  },

  deleteSnippet: (id: string) => {
    // Updates the snippet at the ID with a new snippet,
    // replaces the entire value including ID
    const snippets = get().snippets
    if (snippets[id]) {
      const { [id]: snippetData, ...restSnippets } = snippets
      set({ snippets: restSnippets })
    }
  },
  editor: { snippet: undefined },

  loadSnippet: (id: string) => {
    const snippetToLoad = get().snippets[id]

    if (snippetToLoad) {
      set({ editor: { snippet: snippetToLoad } })
    }
  }
})

export const useSnippetStore = createStore(snippetStoreConfig, StoreIdentifier.SNIPPETS, true)
