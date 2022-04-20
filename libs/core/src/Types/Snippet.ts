export interface Snippet {
  id: string
  title: string
  icon: string
  content: any[]
}

export interface SnippetEditorStore {
  snippet?: Snippet
}

export interface SnippetStoreState {
  snippets: Snippet[]

  initSnippets: (snippets: Snippet[]) => void
  addSnippet: (snippets: Snippet) => void
  updateSnippet: (id: string, snippets: Snippet) => void
  deleteSnippet: (id: string) => void

  editor: SnippetEditorStore
  loadSnippet: (id: string) => void
}
