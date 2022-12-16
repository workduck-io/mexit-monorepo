import { convertContentToRawText, getSnippetCommand, mog, Snippet, SnippetID } from '@mexit/core'
import { useSlashCommands } from '@mexit/shared'

import { SlashCommandConfig } from '../Editor/Types/Combobox'
import { useDataStore } from '../Stores/useDataStore'
import { useDescriptionStore } from '../Stores/useDescriptionStore'
import { useSnippetStore } from '../Stores/useSnippetStore'

import { useSearch } from './useSearch'

export const useSnippets = () => {
  const addSnippetZus = useSnippetStore((state) => state.addSnippet)
  const updateSnippetZus = useSnippetStore((state) => state.updateSnippet)
  const updateSnippetsInStore = useSnippetStore((state) => state.initSnippets)

  const deleteSnippetZus = useSnippetStore((state) => state.deleteSnippet)
  const setSlashCommands = useDataStore((store) => store.setSlashCommands)
  const updateDescription = useDescriptionStore((store) => store.updateDescription)

  const { generateSlashCommands } = useSlashCommands()
  const { updateDocument, addDocument, removeDocument } = useSearch()

  const getSnippets = () => {
    return useSnippetStore.getState().snippets ?? {}
  }

  const getSnippetConfigs = (): { [key: string]: SlashCommandConfig } => {
    const snippets = useSnippetStore.getState().snippets ?? {}

    return Object.values(snippets).reduce((prev, cur) => {
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

  const updateSlashCommands = (snippets: Snippet[]) => {
    const slashCommands = generateSlashCommands(snippets)
    setSlashCommands(slashCommands)
  }

  const getSnippet = (id: string) => {
    const snippets = useSnippetStore.getState().snippets

    return snippets?.[id]
  }

  // Replacer that will provide new fresh and different content each time
  const getSnippetContent = (command: string) => {
    const snippets = useSnippetStore.getState().snippets ?? {}
    const snippet = Object.values(snippets).filter((c) => getSnippetCommand(c.title) === command)

    if (snippet.length > 0) return snippet[0].content
    return undefined
  }

  const updateSnippetIndex = async (snippet) => {
    const tags = snippet?.template ? ['template'] : ['snippet']
    const idxName = snippet?.template ? 'template' : 'snippet'

    if (snippet?.template) {
      await removeDocument('snippet', snippet.id)
    } else {
      await removeDocument('template', snippet.id)
    }
    await updateDocument(idxName, snippet.id, snippet.content, snippet.title, tags)
  }

  const updateSnippets = async (snippets: Record<SnippetID, Snippet>) => {
    const existingSnippets = useSnippetStore.getState().snippets

    const newSnippets = { ...(Array.isArray(existingSnippets) ? {} : existingSnippets), ...snippets }

    updateSnippetsInStore(newSnippets)
    const snippetsArr = Object.values(newSnippets)
    updateSlashCommands(snippetsArr)

    snippetsArr.forEach(async (snippet) => {
      updateDescription(snippet.id, {
        rawText: convertContentToRawText(snippet.content, '\n'),
        truncatedContent: snippet.content.slice(0, 8)
      })
      await updateSnippetIndex(snippet)
    })
  }

  const updateSnippet = async (snippet: Snippet) => {
    updateSnippetZus(snippet.id, snippet)
    const tags = snippet?.template ? ['template'] : ['snippet']
    const idxName = snippet?.template ? 'template' : 'snippet'
    if (snippet?.template) {
      await removeDocument('snippet', snippet.id)
    } else {
      await removeDocument('template', snippet.id)
    }
    await updateDocument(idxName, snippet.id, snippet.content, snippet.title, tags)

    updateSlashCommands(Object.values(getSnippets()))

    updateDescription(snippet.id, {
      rawText: convertContentToRawText(snippet.content, '\n'),
      truncatedContent: snippet.content.slice(0, 8)
    })
  }

  const deleteSnippet = async (id: string) => {
    deleteSnippetZus(id)
    await removeDocument('snippet', id)

    updateSlashCommands(Object.values(getSnippets()))
  }

  const addSnippet = async (snippet: Snippet) => {
    addSnippetZus(snippet)
    const tags = snippet?.template ? ['template'] : ['snippet']
    const idxName = snippet?.template ? 'template' : 'snippet'
    mog('Add snippet', { snippet, tags })

    await updateDocument(idxName, snippet.id, snippet.content, snippet.title, tags)

    updateSlashCommands(Object.values(getSnippets()))

    updateDescription(snippet.id, {
      rawText: convertContentToRawText(snippet.content, '\n'),
      truncatedContent: snippet.content.slice(0, 8)
    })
  }

  return {
    getSnippets,
    getSnippet,
    getSnippetContent,
    getSnippetConfigs,
    addSnippet,
    updateSnippet,
    deleteSnippet,
    updateSnippets
  }
}
