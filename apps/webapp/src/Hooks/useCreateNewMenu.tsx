import toast from 'react-hot-toast'

import { defaultContent, generateSnippetId } from '@mexit/core'
import { InteractiveToast } from '@mexit/shared'

import { useLayoutStore } from '../Stores/useLayoutStore'
import { useUserPreferenceStore } from '../Stores/userPreferenceStore'
import { useSnippetStore } from '../Stores/useSnippetStore'
import { useCreateNewNote } from './useCreateNewNote'
import { useNamespaces } from './useNamespaces'
import { NavigationType,ROUTE_PATHS, useRouting } from './useRouting'
import { useSnippets } from './useSnippets'
import { useUpdater } from './useUpdater'
import { IconifyIcon } from '@iconify/react'
import { ELEMENT_PARAGRAPH } from '@udecode/plate'
import generateName from 'project-name-generator'

interface CreateNewMenuItem {
  id: string
  label: string
  icon?: string | IconifyIcon
  onSelect: () => void
}

export const useCreateNewMenu = () => {
  const { goTo } = useRouting()
  const { createNewNote } = useCreateNewNote()
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const { addSnippet } = useSnippets()
  const { updater } = useUpdater()
  const { addDefaultNewNamespace, getDefaultNamespaceId } = useNamespaces()
  const currentSpace = useUserPreferenceStore((store) => store.activeNamespace)
  const changeSpace = useUserPreferenceStore((store) => store.setActiveNamespace)
  const expandSidebar = useLayoutStore((store) => store.expandSidebar)

  const createNewNamespace = () => {
    addDefaultNewNamespace()
      .then((ns) => {
        if (ns) changeSpace(ns.id)
        return ns
      })
      .then((ns) => {
        toast.custom((t) => (
          <InteractiveToast
            tid={t.id}
            message={`Created new space: ${ns?.name}`}
            actionName="Open"
            onClick={() => {
              if (ns) changeSpace(ns.id)
              expandSidebar()
            }}
          />
        ))
      })
  }

  const createNewNoteInNamespace = (namespaceId: string) => {
    const note = createNewNote({ namespace: namespaceId, noteContent: defaultContent.content })

    if (note) {
      goTo(ROUTE_PATHS.node, NavigationType.push, note?.nodeid)
    }
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

  const getCreateNewMenuItems = (_path: string): CreateNewMenuItem[] => {
    return [
      {
        id: 'new-note',
        label: 'New Note',
        onSelect: () => {
          createNewNoteInNamespace(currentSpace || getDefaultNamespaceId())
        }
      },
      {
        id: 'new-space',
        label: 'New Space',
        onSelect: () => {
          createNewNamespace()
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
