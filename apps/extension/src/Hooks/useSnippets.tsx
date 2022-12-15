import { getSnippetCommand, Snippet, SnippetID } from '@mexit/core'
import { useSlashCommands } from '@mexit/shared'

import useDataStore from '../Stores/useDataStore'
import { useSnippetStore } from '../Stores/useSnippetStore'

export const useSnippets = () => {
  const updateSnippetsInStore = useSnippetStore((state) => state.initSnippets)

  const setSlashCommands = useDataStore((store) => store.setSlashCommands)

  const { generateSlashCommands } = useSlashCommands()

  const getSnippets = () => {
    return useSnippetStore.getState().snippets
  }

  const getSnippet = (id: string) => {
    const snippets = useSnippetStore.getState().snippets
    return snippets?.[id]
  }

  const updateSlashCommands = (snippets: Snippet[]) => {
    const slashCommands = generateSlashCommands(snippets)
    setSlashCommands(slashCommands)
  }

  // Replacer that will provide new fresh and different content each time
  const getSnippetContent = (command: string) => {
    const snippets = useSnippetStore.getState().snippets ?? {}
    const snippet = Object.values(snippets).filter((c) => getSnippetCommand(c.title) === command)

    if (snippet.length > 0) return snippet[0].content
    return undefined
  }

  const updateSnippets = async (snippets: Record<SnippetID, Snippet>) => {
    const existingSnippets = useSnippetStore.getState().snippets

    const newSnippets = { ...(Array.isArray(existingSnippets) ? {} : existingSnippets), ...snippets }

    updateSnippetsInStore(newSnippets)
    updateSlashCommands(Object.values(newSnippets))
  }

  return { getSnippets, getSnippet, getSnippetContent, updateSnippets }
}
