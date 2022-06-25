import { getSnippetCommand, Snippet } from '@mexit/core'
import { useSlashCommands } from '@mexit/shared'
import useDataStore from '../Stores/useDataStore'
import { useSnippetStore } from '../Stores/useSnippetStore'

export const useSnippets = () => {
  const initSnippets = useSnippetStore((store) => store.initSnippets)
  const setSlashCommands = useDataStore((store) => store.setSlashCommands)

  const { generateSlashCommands } = useSlashCommands()

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

  // * Updates snippets in store and adds them in combobox
  const updateSnippets = (snippets: Snippet[]) => {
    initSnippets(snippets)
    const slashCommands = generateSlashCommands(snippets)
    setSlashCommands(slashCommands)
  }

  return { getSnippets, getSnippet, updateSnippets, getSnippetContent }
}
