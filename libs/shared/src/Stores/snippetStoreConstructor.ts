import { Snippet } from '../Types/Snippet'

export const snippetStoreConstructor = (set) => ({
  snippets: [],

  initSnippets: (snippets: Snippet[]) =>
    set({
      snippets
    }),

  addSnippet: (snippet: Snippet) => set((state) => ({ snippets: [...state.snippets, snippet] })),

  updateSnippet: (id: string, snippet: Snippet) =>
    // Updates the snippet at the ID with a new snippet,
    // replaces the entire value including ID
    set((state) => {
      const snippets = state.snippets.filter((s) => s.id !== id)
      return { snippets: [...snippets, snippet] }
    }),

  deleteSnippet: (id: string) =>
    // Updates the snippet at the ID with a new snippet,
    // replaces the entire value including ID
    set((state) => {
      const snippets = state.snippets.filter((s) => s.id !== id)
      return { snippets }
    }),

  editor: { snippet: undefined },

  loadSnippet: (id: string) =>
    set((state) => {
      const snippet = state.snippets.filter((s) => s.id === id)
      if (snippet.length > 0) {
        return { editor: { snippet: snippet[0] } }
      }
    })
})
