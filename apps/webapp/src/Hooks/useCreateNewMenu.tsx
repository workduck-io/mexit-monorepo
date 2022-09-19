import { IconifyIcon } from '@iconify/react'
import { ELEMENT_PARAGRAPH } from '@udecode/plate'
import generateName from 'project-name-generator'

import { defaultContent, generateSnippetId } from '@mexit/core'

import { useSnippetStore } from '../Stores/useSnippetStore'
import { useCreateNewNote } from './useCreateNewNote'
import { useRouting, ROUTE_PATHS, NavigationType } from './useRouting'
import { useSnippets } from './useSnippets'
import { useUpdater } from './useUpdater'

interface CreateNewMenuItem {
  id: string
  label: string
  icon?: string | IconifyIcon
  onSelect: () => void
}

// TODO: Add ordering and filtering based on Path
interface CreateNewMenuConfig {
  // If passed, and the path matches/starts with this path
  // The menu item is moved above
  path?: string
}

export const useCreateNewMenu = () => {
  const { goTo } = useRouting()
  const { createNewNote } = useCreateNewNote()
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const { addSnippet } = useSnippets()
  const { updater } = useUpdater()

  const createNoteWithDefaultContent = () => {
    const noteId = createNewNote({ noteContent: defaultContent.content })

    goTo(ROUTE_PATHS.node, NavigationType.push, noteId)
  }

  const onCreateNewSnippet = () => {
    // Create a better way.
    const snippetId = generateSnippetId()
    const snippetName = generateName().dashed

    addSnippet({
      id: snippetId,
      title: snippetName,
      icon: 'ri:quill-pen-line',
      content: [{ children: [{ text: '' }], type: ELEMENT_PARAGRAPH }]
    })

    loadSnippet(snippetId)
    updater()

    goTo(ROUTE_PATHS.snippet, NavigationType.push, snippetId, { title: snippetName })
  }
  const getCreateNewMenuItems = (path: string): CreateNewMenuItem[] => {
    return [
      {
        id: 'new-note',
        label: 'New Note',
        onSelect: () => {
          createNoteWithDefaultContent()
        }
      },
      {
        id: 'new-snippet',
        label: 'New Snippet',
        onSelect: () => {
          onCreateNewSnippet()
        }
      }
    ]
  }

  return { getCreateNewMenuItems }
}
