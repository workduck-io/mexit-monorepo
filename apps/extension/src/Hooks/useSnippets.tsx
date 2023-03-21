import { toast } from 'react-hot-toast'

import { Indexes } from '@workduck-io/mex-search'

import {
  convertContentToRawText,
  DefaultMIcons,
  extractMetadata,
  getSnippetCommand,
  Snippet,
  SnippetID
} from '@mexit/core'
import { useSlashCommands } from '@mexit/shared'

import useDataStore from '../Stores/useDataStore'
import { useDescriptionStore } from '../Stores/useDescriptionStore'
import { useMetadataStore } from '../Stores/useMetadataStore'
import { useSnippetStore } from '../Stores/useSnippetStore'
import { wUpdateDoc } from '../Sync/invokeOnWorker'

import { useAuthStore } from './useAuth'
import { useEditorStore } from './useEditorStore'
import { useSputlitContext, VisualState } from './useSputlitContext'

export const useSnippets = () => {
  const updateSnippetsInStore = useSnippetStore((state) => state.initSnippets)
  const addSnippetInStore = useSnippetStore((state) => state.addSnippet)
  const updateDescription = useDescriptionStore((store) => store.updateDescription)
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const { setVisualState } = useSputlitContext()
  const setPreviewMode = useEditorStore((s) => s.setPreviewMode)
  const addMetadata = useMetadataStore((s) => s.addMetadata)
  const setSlashCommands = useDataStore((store) => store.setSlashCommands)

  const { generateSlashCommands } = useSlashCommands()

  const getSnippets = () => {
    return useSnippetStore.getState().snippets
  }

  const getSnippet = (id: string) => {
    const snippets = useSnippetStore.getState().snippets
    return snippets?.[id]
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
        wUpdateDoc({
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

  return { getSnippets, getSnippet, addSnippet, getSnippetContent, updateSnippets }
}
