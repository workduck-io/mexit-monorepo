import { Snippet } from '@mexit/shared'

import { SEPARATOR } from '@mexit/shared'
// import { parseBlock } from '../Utils/flexsearch'
import { useSnippetStore } from '../Stores/useSnippetStore'

// import useSearchStore from './useSearchStore'
import { SlashCommandConfig } from '@workduck-io/mex-editor'

import useSearchStore from './useSearchStore'
import { parseSnippet } from '@mexit/shared'

export const useSnippets = () => {
  const addSnippetStore = useSnippetStore((state) => state.addSnippet)
  const updateSnippetStore = useSnippetStore((state) => state.updateSnippet)
  const deleteSnippetStore = useSnippetStore((state) => state.deleteSnippet)
  const { addDoc, updateDoc, removeDoc } = useSearchStore(({ addDoc, updateDoc, removeDoc }) => ({
    addDoc,
    updateDoc,
    removeDoc
  }))
  const getSnippets = () => {
    return useSnippetStore.getState().snippets
  }

  const getSnippetsConfigs = (): { [key: string]: SlashCommandConfig } => {
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

  const updateSnippet = (snippet: Snippet) => {
    updateSnippetStore(snippet.id, snippet)
    updateDoc('snippet', parseSnippet(snippet))
  }
  const deleteSnippet = (id: string) => {
    deleteSnippetStore(id)
    removeDoc('snippet', id)
  }
  const addSnippet = (snippet: Snippet) => {
    addSnippetStore(snippet)
    addDoc('snippet', parseSnippet(snippet))
  }

  return { getSnippets, getSnippet, getSnippetContent, getSnippetsConfigs, addSnippet, updateSnippet, deleteSnippet }
}

export const extractSnippetCommands = (snippets: Snippet[]): string[] => {
  return snippets.map((c) => getSnippetCommand(c.title))
}

export const SnippetCommandPrefix = `snip`
export const getSnippetCommand = (title: string) => `${SnippetCommandPrefix}${SEPARATOR}${title}`
