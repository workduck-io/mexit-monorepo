import { SEPARATOR } from '@mexit/core'
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

  // Replacer that will provide new fresh and different content each time
  const getSnippetContent = (command: string) => {
    const snippets = useSnippetStore.getState().snippets
    const snippet = snippets.filter((c) => getSnippetCommand(c.title) === command)

    if (snippet.length > 0) return snippet[0].content
    return undefined
  }

  return { getSnippets, getSnippet, getSnippetContent }
}

export const SnippetCommandPrefix = `snip`
export const getSnippetCommand = (title: string) => `${SnippetCommandPrefix}${SEPARATOR}${title}`
