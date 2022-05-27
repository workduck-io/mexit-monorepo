export interface Snippet {
  id: string
  title: string
  icon?: string
  content: any[]
  isTemplate?: boolean
}

export interface SnippetEditorStore {
  snippet?: Snippet
}

export interface SnippetStoreState {
  snippets: Snippet[]

  initSnippets: (snippets: Snippet[]) => void
  addSnippet: (snippets: Snippet) => void
  updateSnippet: (id: string, snippets: Snippet) => void
  updateSnippetContent: (id: string, content: any[], isTemplate?: boolean) => void
  updateSnippetContentAndTitle: (id: string, content: any[], title: string, isTemplate?: boolean) => void
  deleteSnippet: (id: string) => void

  editor: SnippetEditorStore
  loadSnippet: (id: string) => void
}
