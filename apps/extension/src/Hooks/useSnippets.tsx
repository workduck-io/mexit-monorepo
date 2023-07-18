import { toast } from 'react-hot-toast'

import { Indexes } from '@workduck-io/mex-search'

import {
  convertContentToRawText,
  DefaultMIcons,
  extractMetadata,
  getSnippetCommand,
  Snippet,
  SnippetID,
  useAuthStore,
  useDataStore,
  useDescriptionStore,
  useMetadataStore,
  useSnippetStore
} from '@mexit/core'
import { useSlashCommands } from '@mexit/shared'

import { useEditorStore } from './useEditorStore'
import { useSearch } from './useSearch'
import { useSputlitContext, VisualState } from './useSputlitContext'

export const useSnippets = () => {
  const updateSnippetsInStore = useSnippetStore((state) => state.initSnippets)
  const updateSnippetInStore = useSnippetStore((state) => state.updateSnippet)
  const addSnippetInStore = useSnippetStore((state) => state.addSnippet)
  const deleteSnippetInStore = useSnippetStore((state) => state.deleteSnippet)
  const updateDescription = useDescriptionStore((store) => store.updateDescription)
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const { setVisualState } = useSputlitContext()

  const setPreviewMode = useEditorStore((s) => s.setPreviewMode)
  const addMetadata = useMetadataStore((s) => s.addMetadata)
  const setSlashCommands = useDataStore((store) => store.setSlashCommands)

  const { updateDocument, removeDocument } = useSearch()
  const { generateSlashCommands } = useSlashCommands()

  const getSnippets = () => {
    return useSnippetStore.getState().snippets
  }

  const getSnippet = (id: string) => {
    const snippets = useSnippetStore.getState().snippets
    return snippets?.[id]
  }

  const updateSnippetIndex = async (snippet: Snippet) => {
    const tags = snippet?.template ? ['template'] : ['snippet']

    if (snippet)
      await updateDocument({
        indexKey: Indexes.SNIPPET,
        id: snippet.id,
        contents: snippet.content,
        title: snippet.title,
        options: {
          tags
        }
      })
  }

  const addSnippet = async (snippet: Snippet, notify = true) => {
    addSnippetInStore(snippet)

    const idxName = snippet?.template ? 'template' : 'snippet'

    const request = {
      type: 'NEW_SNIPPET',
      data: {
        id: snippet.id,
        title: snippet.title,
        content: snippet.content,
        workspaceId: getWorkspaceId(),
        template: snippet.template
      }
    }

    chrome.runtime.sendMessage(request, (response) => {
      const { message, error } = response
      if (error) {
        console.error('An Error Occured. Please try again.')
      } else {
        const metadata = extractMetadata(message.metadata, { icon: DefaultMIcons.SNIPPET })

        addMetadata('snippets', { [message.id]: metadata })

        updateDocument({
          indexKey: Indexes.SNIPPET,
          id: message.id,
          contents: request.data.content,
          title: message.title
        })

        if (notify) {
          toast.success('Saved to Cloud')
        }

        setVisualState(VisualState.animatingOut)
        // So that sputlit opens with preview true when it opens the next time
        setPreviewMode(true)
      }
    })

    updateDescription(snippet.id, {
      rawText: convertContentToRawText(snippet.content, '\n'),
      truncatedContent: snippet.content.slice(0, 8)
    })
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

  const updateSnippet = async (snippet: Snippet) => {
    updateSnippetInStore(snippet.id, snippet)
    await updateSnippetIndex(snippet)

    updateSlashCommands(Object.values(getSnippets()))

    updateDescription(snippet.id, {
      rawText: convertContentToRawText(snippet.content, '\n'),
      truncatedContent: snippet.content.slice(0, 8)
    })
  }

  const deleteSnippet = async (id: string) => {
    deleteSnippetInStore(id)
    await removeDocument(Indexes.SNIPPET, id)

    updateSlashCommands(Object.values(getSnippets()))
  }

  return { getSnippets, getSnippet, addSnippet, getSnippetContent, updateSnippets, updateSnippet, deleteSnippet }
}
