import { useSnippetStore } from '../Stores/useSnippetStore'

export const useSnippets = () => {
  const getSnippets = () => {
    return useSnippetStore.getState().snippets
  }

  const getSnippet = (id: string) => {
    const snippets = useSnippetStore.getState().snippets
    const snippet = snippets.filter((c) => c.id === id)

    if (snippet.length > 0) return snippet[0]
    return undefined
  }

  return { getSnippets, getSnippet }
}
