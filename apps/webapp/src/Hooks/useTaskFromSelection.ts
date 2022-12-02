import { format } from 'date-fns'

import { BASE_TASKS_PATH, NodeEditorContent, SEPARATOR } from '@mexit/core'

import { useDataStore } from '../Stores/useDataStore'

import { useCreateNewNote } from './useCreateNewNote'
import { useNamespaces } from './useNamespaces'

export const getTodayTaskNodePath = () => {
  return `${BASE_TASKS_PATH}${SEPARATOR}${format(Date.now(), 'do MMM yyyy')}`
}

export const useTaskFromSelection = () => {
  const { createNewNote } = useCreateNewNote()
  const { getDefaultNamespaceId } = useNamespaces()

  const getNewTaskNode = (create?: boolean, nodeContent?: NodeEditorContent) => {
    const todayTaskNodePath = getTodayTaskNodePath()
    const links = useDataStore.getState().ilinks
    const link = links.find((l) => l.path === todayTaskNodePath)
    const dailyTaskNode = links.find((l) => l.path === BASE_TASKS_PATH)

    const node = link
      ? link
      : create
      ? createNewNote({
          path: todayTaskNodePath,
          parent: { path: dailyTaskNode?.nodeid, namespace: dailyTaskNode?.namespace },
          noteContent: nodeContent,
          namespace: getDefaultNamespaceId()
        })
      : undefined

    return node
  }

  return {
    getNewTaskNode
  }
}
