import React from 'react'
import toast from 'react-hot-toast'

import generateName from 'project-name-generator'

import {
  ELEMENT_PARAGRAPH,
  ELEMENT_TODO_LI,
  generateSnippetId,
  generateTempId,
  getDefaultContent,
  ModalsType,
  TodoStatus,
  useEditorStore,
  useLayoutStore,
  useModalStore,
  userPreferenceStore as useUserPreferenceStore,
  useSnippetStore
} from '@mexit/core'
import { DefaultMIcons, InteractiveToast } from '@mexit/shared'

import { createDefaultTodo } from '../../Editor/Plugins/todoUtils'
import { useCreateNewNote } from '../../Hooks/useCreateNewNote'
import { useNamespaces } from '../../Hooks/useNamespaces'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { useSnippets } from '../../Hooks/useSnippets'
import { useTaskFromSelection } from '../../Hooks/useTaskFromSelection'

export const useOnNewItem = () => {
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const changeSpace = useUserPreferenceStore((store) => store.setActiveNamespace)

  const { goTo } = useRouting()
  const { addSnippet } = useSnippets()
  const { createNewNote } = useCreateNewNote()
  const { getNewTaskNode } = useTaskFromSelection()
  const { addDefaultNewNamespace, getDefaultNamespaceId } = useNamespaces()
  const expandSidebar = useLayoutStore((store) => store.expandSidebar)

  const openModal = useModalStore((store) => store.toggleOpen)

  const onNewNote = (spaceId: string) => {
    const note = createNewNote({ namespace: spaceId })

    if (note) goTo(ROUTE_PATHS.node, NavigationType.push, note?.nodeid)
  }

  const onNewTask = () => {
    const dailyTasksNoteId = getNewTaskNode(true)?.nodeid
    const todo = createDefaultTodo(dailyTasksNoteId, [
      {
        type: ELEMENT_TODO_LI,
        children: [{ text: '', type: ELEMENT_PARAGRAPH, id: generateTempId() }],
        status: TodoStatus.todo,
        id: generateTempId()
      }
    ])

    openModal(ModalsType.todo, todo)
  }

  const onNewContent = () => {
    openModal(ModalsType.todo, {
      type: 'content'
    })
  }

  const onNewSnippet = () => {
    const snippetId = generateSnippetId()
    const snippetName = generateName().dashed

    addSnippet({
      id: snippetId,
      title: snippetName,
      icon: DefaultMIcons.SNIPPET,
      content: [getDefaultContent()]
    })

    loadSnippet(snippetId)

    goTo(ROUTE_PATHS.snippet, NavigationType.push, snippetId, { title: snippetName })
  }

  const onNewSpace = () => {
    addDefaultNewNamespace()
      .then((space) => {
        if (space) {
          changeSpace(space.id)
          const openedNote = useEditorStore.getState().node.nodeid
          if (openedNote) goTo(ROUTE_PATHS.node, NavigationType.push, openedNote)
        }
        return space
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

  const getQuickNewItems = (withMIcon = false) => {
    const data = {
      note: {
        id: 0,
        name: 'New Note',
        icon: withMIcon ? DefaultMIcons.NOTE : DefaultMIcons.NOTE.value,
        onSelect: () => {
          const activeNamesapce = useUserPreferenceStore.getState().activeNamespace
          const spaceId = activeNamesapce ?? getDefaultNamespaceId()

          onNewNote(spaceId)
        }
      },
      space: {
        id: 1,
        name: 'New Space',
        icon: withMIcon ? DefaultMIcons.SPACE : DefaultMIcons.SPACE.value,
        onSelect: onNewSpace
      },
      task: {
        id: 2,
        name: 'New Task',
        icon: withMIcon ? DefaultMIcons.TASK : DefaultMIcons.TASK.value,
        onSelect: onNewTask
      },
      snippet: {
        id: 3,
        name: 'New Snippet',
        icon: withMIcon ? DefaultMIcons.SNIPPET : DefaultMIcons.SNIPPET.value,
        onSelect: onNewSnippet
      },
      content: {
        id: 4,
        name: 'New Content',
        icon: withMIcon ? DefaultMIcons.TEXT : DefaultMIcons.TEXT.value,
        onSelect: onNewContent
      }
    }

    return data
  }

  return {
    getQuickNewItems
  }
}
