import { mog, SEPARATOR, Snippet } from '@mexit/core'
import { SlashCommandConfig } from '../Editor/Types/Combobox'
import { useSnippetStore } from '../Stores/useSnippetStore'
import { useSearch } from './useSearch'

export const useSnippets = () => {
  const addSnippetZus = useSnippetStore((state) => state.addSnippet)
  const updateSnippetZus = useSnippetStore((state) => state.updateSnippet)
  const deleteSnippetZus = useSnippetStore((state) => state.deleteSnippet)

  const { updateDocument, addDocument, removeDocument } = useSearch()

  const getSnippets = () => {
    return useSnippetStore.getState().snippets
  }

  const getSnippetConfigs = (): { [key: string]: SlashCommandConfig } => {
    const snippets = useSnippetStore.getState().snippets
    return snippets.reduce((prev, cur) => {
      const snipCommand = getSnippetCommand(cur.title)
      return {
        ...prev,
        [snipCommand]: {
          slateElementType: '__SPECIAL__SNIPPETS',
          command: snipCommand
        }
      }
    }, {})
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

  const updateSnippet = async (snippet: Snippet) => {
    updateSnippetZus(snippet.id, snippet)
    const tags = snippet.isTemplate ? ['template'] : ['snippet']
    const idxName = snippet.isTemplate ? 'template' : 'snippet'
    mog('Update snippet', { snippet, tags })
    if (snippet.isTemplate) {
      await removeDocument('snippet', snippet.id)
    } else {
      await removeDocument('template', snippet.id)
    }
    await updateDocument(idxName, snippet.id, snippet.content, snippet.title, tags)
  }

  const deleteSnippet = async (id: string) => {
    deleteSnippetZus(id)
    await removeDocument('snippet', id)
  }

  const addSnippet = async (snippet: Snippet) => {
    addSnippetZus(snippet)
    const tags = snippet.isTemplate ? ['template'] : ['snippet']
    const idxName = snippet.isTemplate ? 'template' : 'snippet'
    mog('Add snippet', { snippet, tags })

    await updateDocument(idxName, snippet.id, snippet.content, snippet.title, tags)
  }

  return {
    getSnippets,
    getSnippet,
    getSnippetContent,
    getSnippetConfigs,
    addSnippet,
    updateSnippet,
    deleteSnippet
  }
}

export const extractSnippetCommands = (snippets: Snippet[]): string[] => {
  return snippets.map((c) => getSnippetCommand(c.title))
}

export const SnippetCommandPrefix = `snip`
export const getSnippetCommand = (title: string) => `${SnippetCommandPrefix}${SEPARATOR}${title}`
