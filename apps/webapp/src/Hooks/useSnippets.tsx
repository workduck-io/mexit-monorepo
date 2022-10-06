import { convertContentToRawText, getSnippetCommand, mog, SEPARATOR, Snippet } from '@mexit/core'
import { useSlashCommands } from '@mexit/shared'

import { SlashCommandConfig } from '../Editor/Types/Combobox'
import { useDataStore } from '../Stores/useDataStore'
import { useDescriptionStore } from '../Stores/useDescriptionStore'
import { useSnippetStore } from '../Stores/useSnippetStore'
import { useApi } from './API/useNodeAPI'
import { useSearch } from './useSearch'

export const useSnippets = () => {
  const addSnippetZus = useSnippetStore((state) => state.addSnippet)
  const updateSnippetZus = useSnippetStore((state) => state.updateSnippet)
  const deleteSnippetZus = useSnippetStore((state) => state.deleteSnippet)
  const initSnippets = useSnippetStore((store) => store.initSnippets)
  const setSlashCommands = useDataStore((store) => store.setSlashCommands)
  const updateDescription = useDescriptionStore((store) => store.updateDescription)

  const { generateSlashCommands } = useSlashCommands()
  const { updateDocument, addDocument, removeDocument } = useSearch()
  const api = useApi()

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
    const tags = snippet?.template ? ['template'] : ['snippet']
    const idxName = snippet?.template ? 'template' : 'snippet'
    mog('Update snippet', { snippet, tags })
    if (snippet?.template) {
      await removeDocument('snippet', snippet.id)
    } else {
      await removeDocument('template', snippet.id)
    }
    await updateDocument(idxName, snippet.id, snippet.content, snippet.title, tags)

    const slashCommands = generateSlashCommands(getSnippets())
    setSlashCommands(slashCommands)

    updateDescription(snippet.id, convertContentToRawText(snippet.content, ' '))
  }

  const deleteSnippet = async (id: string) => {
    deleteSnippetZus(id)
    await removeDocument('snippet', id)

    const slashCommands = generateSlashCommands(getSnippets())
    setSlashCommands(slashCommands)
  }

  const addSnippet = async (snippet: Snippet) => {
    addSnippetZus(snippet)
    const tags = snippet?.template ? ['template'] : ['snippet']
    const idxName = snippet?.template ? 'template' : 'snippet'
    mog('Add snippet', { snippet, tags })

    await updateDocument(idxName, snippet.id, snippet.content, snippet.title, tags)

    const slashCommands = generateSlashCommands(getSnippets())
    setSlashCommands(slashCommands)

    updateDescription(snippet.id, convertContentToRawText(snippet.content, ' '))
  }

  const getInitialSnippets = () => {
    const snippets = getSnippets()
    const unfetchedSnippets = snippets.filter((snippet) => !snippet.content)

    // try {
    //   Promise.allSettled(
    //     unfetchedSnippets.map(
    //       async (item) =>
    //         await api.getSnippetById(item.id).then((response) => {
    //           updateSnippet(response as Snippet)
    //         })
    //     )
    //   )
    // } catch (err) {
    //   mog('Failed to fetch snippets', { err })
    // }
  }

  // * Updates snippets in store and adds them in combobox
  const updateSnippets = (snippets: Snippet[]) => {
    initSnippets(snippets)
    const slashCommands = generateSlashCommands(snippets)
    setSlashCommands(slashCommands)
  }

  return {
    getSnippets,
    getSnippet,
    getSnippetContent,
    getSnippetConfigs,
    addSnippet,
    updateSnippet,
    deleteSnippet,
    getInitialSnippets,
    updateSnippets
  }
}
