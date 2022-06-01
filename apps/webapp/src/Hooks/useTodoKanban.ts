import {
  TodoType,
  TodoStatus,
  PriorityType,
  convertContentToRawText,
  TodoRanks,
  TodoStatusRanks,
  SNIPPET_PREFIX
} from '@mexit/core'
import { isElder, getAllParentIds } from '@mexit/shared'
import { ELEMENT_TODO_LI } from '@udecode/plate'
import { useLinks, useNodes, useTodoStore } from '@workduck-io/mex-editor'
import create from 'zustand'
import { defaultContent } from '../Data/baseData'
import { KanbanCard, KanbanColumn, KanbanBoard } from '../Types/Kanban'
import { SearchFilter, FilterStore } from './useFilters'

export interface TodoKanbanCard extends KanbanCard {
  todo: TodoType
}

export interface KanbanBoardColumn extends KanbanColumn {
  id: TodoStatus
  cards: TodoKanbanCard[]
}

export interface TodoKanbanBoard extends KanbanBoard {
  columns: KanbanBoardColumn[]
}

// interface KanbanStore extends FilterStore<TodoType> {}

export const getPureContent = (todo: TodoType) => {
  const { content } = todo
  if (content.length > 0) {
    if (content[0].type !== ELEMENT_TODO_LI) return content
    else return content[0].children
  }
  return defaultContent
}

export const useKanbanFilterStore = create<FilterStore<TodoType>>((set) => ({
  currentFilters: [],
  setCurrentFilters: (filters: SearchFilter<TodoType>[]) => set({ currentFilters: filters }),
  filters: [],
  setFilters: (filters: SearchFilter<TodoType>[]) => set({ filters })
}))

export const useTodoKanban = () => {
  const filters = useKanbanFilterStore((state) => state.filters)
  const currentFilters = useKanbanFilterStore((state) => state.currentFilters)
  const setCurrentFilters = useKanbanFilterStore((state) => state.setCurrentFilters)
  const setFilters = useKanbanFilterStore((s) => s.setFilters)
  const updateTodo = useTodoStore((s) => s.updateTodoOfNode)
  const { getPathFromNodeid } = useLinks()
  const { isInArchive } = useNodes()

  const changeStatus = (todo: TodoType, newStatus: TodoStatus) => {
    updateTodo(todo.nodeid, { ...todo, metadata: { ...todo.metadata, status: newStatus } })
  }

  const changePriority = (todo: TodoType, newPriority: PriorityType) => {
    updateTodo(todo.nodeid, { ...todo, metadata: { ...todo.metadata, priority: newPriority } })
  }

  const generateTodoNodeFilters = (board: TodoKanbanBoard) => {
    const todoNodes: string[] = []
    board.columns.forEach((column) => {
      column.cards.forEach((card) => {
        todoNodes.push(card.todo.nodeid)
      })
    })

    // All paths in which the todos occur
    const rankedPaths = todoNodes.reduce((acc, item) => {
      const path = getPathFromNodeid(item)
      if (!path) return acc
      const allPaths = getAllParentIds(path)
      // const allPaths =
      allPaths.forEach((path) => {
        if (acc[path]) {
          acc[path] += 1
        } else {
          acc[path] = 1
        }
      })
      return acc
    }, {} as { [path: string]: number })

    const nodeFilters = Object.entries(rankedPaths).reduce((acc, c) => {
      const [path, rank] = c
      if (rank > 1) {
        // mog('path', { path, rank })
        acc.push({
          key: 'note',
          id: `node_${path}`,
          icon: 'ri:file-list-2-line',
          label: path,
          filter: (item: TodoType) => {
            const itemPath = getPathFromNodeid(item.nodeid)
            if (!itemPath) return false
            // mog('itemPath being filtered', { item, itemPath, path })
            return isElder(itemPath, path) || itemPath === path
          }
        })
      }
      return acc
    }, [] as SearchFilter<TodoType>[])

    // mog('nodeFilters', { rankedPaths, nodeFilters })
    return nodeFilters
  }

  const getTodoBoard = () => {
    const nodetodos = useTodoStore.getState().todos
    const todoBoard: TodoKanbanBoard = {
      columns: [
        {
          id: TodoStatus.todo,
          title: 'Todo',
          cards: []
        },
        {
          id: TodoStatus.pending,
          title: 'In Progress',
          cards: []
        },
        {
          id: TodoStatus.completed,
          title: 'Completed',
          cards: []
        }
      ]
    }
    const currentFilters = useKanbanFilterStore.getState().currentFilters
    Object.entries(nodetodos).forEach(([nodeid, todos]) => {
      if (nodeid.startsWith(SNIPPET_PREFIX)) return
      if (isInArchive(nodeid)) return
      todos
        .filter((todo) => currentFilters.every((filter) => filter.filter(todo)))
        .filter((todo) => {
          // TODO: Find a faster way to check for empty content
          const text = convertContentToRawText(todo.content).trim()
          // mog('empty todo check', { text, nodeid, todo })
          if (text === '') {
            return false
          }
          if (todo.content === defaultContent.content) return false
          return true
        })
        .forEach((todo) => {
          todoBoard.columns
            .find((column) => column.id === todo.metadata.status)
            ?.cards.push({
              id: `KANBAN_ID_${todo.nodeid}_${todo.id}`,
              todo: todo
            })
        })
    })

    const nodeFilters = generateTodoNodeFilters(todoBoard)
    setFilters(nodeFilters)

    todoBoard.columns.forEach((column) => {
      column.cards.sort((a, b) => {
        if (TodoRanks[a.todo.metadata.priority] < TodoRanks[b.todo.metadata.priority]) return 1
        else return -1
      })
    })

    todoBoard.columns.sort((a, b) => {
      if (TodoStatusRanks[a.id] > TodoStatusRanks[b.id]) return 1
      else return -1
    })

    return todoBoard
  }

  const resetFilters = () => {
    setFilters([])
  }

  const addCurrentFilter = (filter: SearchFilter<TodoType>) => {
    setCurrentFilters([...currentFilters, filter])
  }

  const removeCurrentFilter = (filter: SearchFilter<TodoType>) => {
    setCurrentFilters(currentFilters.filter((f) => f.id !== filter.id))
  }

  const resetCurrentFilters = () => {
    setCurrentFilters([])
  }

  return {
    getPureContent,
    getTodoBoard,
    changePriority,
    changeStatus,
    addCurrentFilter,
    removeCurrentFilter,
    resetCurrentFilters,
    resetFilters,
    filters,
    currentFilters
  }
}
