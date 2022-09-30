import { ELEMENT_TODO_LI } from '@udecode/plate'
import create from 'zustand'

import {
  TodoType,
  TodoStatus,
  PriorityType,
  convertContentToRawText,
  TodoRanks,
  TodoStatusRanks,
  SNIPPET_PREFIX,
  SearchFilter,
  getAllParentIds,
  mog,
  Filter,
  Filters,
  FilterTypeWithOptions,
  GlobalFilterJoin
} from '@mexit/core'

import { defaultContent } from '../Data/baseData'
import { useDataStore } from '../Stores/useDataStore'
import { useTodoStore } from '../Stores/useTodoStore'
import { KanbanCard, KanbanColumn, KanbanBoard } from '../Types/Kanban'
import { useTaskFilterFunctions } from './useFilterFunctions'
import { FilterStore } from './useFilters'
import { useLinks } from './useLinks'
import { useMentions } from './useMentions'
import { useNodes } from './useNodes'
import { useSearchExtra } from './useSearch'
import { useTags } from './useTags'

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

export const useKanbanFilterStore = create<FilterStore>((set) => ({
  currentFilters: [],
  setCurrentFilters: (filters: Filter[]) => set({ currentFilters: filters }),
  globalJoin: 'all',
  setGlobalJoin: (join: GlobalFilterJoin) => set({ globalJoin: join }),
  indexes: [],
  setIndexes: () => undefined,
  filters: [],
  setFilters: (filters: Filters) => set({ filters })
}))

export const useTodoKanban = () => {
  const filters = useKanbanFilterStore((state) => state.filters)
  const currentFilters = useKanbanFilterStore((state) => state.currentFilters)
  const setCurrentFilters = useKanbanFilterStore((state) => state.setCurrentFilters)
  const setFilters = useKanbanFilterStore((s) => s.setFilters)
  const globalJoin = useKanbanFilterStore((state) => state.globalJoin)
  const setGlobalJoin = useKanbanFilterStore((state) => state.setGlobalJoin)

  const updateTodo = useTodoStore((s) => s.updateTodoOfNode)
  const tags = useDataStore((state) => state.tags)
  const ilinks = useDataStore((state) => state.ilinks)
  const namespaces = useDataStore((state) => state.namespaces)

  const { getPathFromNodeid, getILinkFromNodeid } = useLinks()
  const { isInArchive } = useNodes()
  const { getSearchExtra } = useSearchExtra()
  const { getUserFromUserid } = useMentions()
  const { getTags } = useTags()
  const taskFilterFunctions = useTaskFilterFunctions()

  const changeStatus = (todo: TodoType, newStatus: TodoStatus) => {
    updateTodo(todo.nodeid, { ...todo, metadata: { ...todo.metadata, status: newStatus } })
  }

  const changePriority = (todo: TodoType, newPriority: PriorityType) => {
    updateTodo(todo.nodeid, { ...todo, metadata: { ...todo.metadata, priority: newPriority } })
  }

  const generateTodoFilters = (board: TodoKanbanBoard) => {
    // Nodes and tags
    const todoNodes: string[] = []
    const todoTags: string[] = []
    const todoMentions: string[] = []

    board.columns.forEach((column) => {
      column.cards.forEach((card) => {
        // Use tags of the node instead of tags
        const tags = getTags(card.todo.nodeid)
        todoNodes.push(card.todo.nodeid)
        todoTags.push(...(tags ?? []))
        todoMentions.push(...(card.todo.mentions ?? []))
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

    const nodeFilters = ilinks.reduce(
      (acc, ilink) => {
        const rank = rankedPaths[ilink.path] ?? 0
        const path = ilink.path
        // const [path, rank] = ilink
        if (rank >= 0) {
          acc.options.push({
            id: `filter_node_${ilink.nodeid}`,
            label: path,
            value: path,
            count: rank
          })
        }
        return acc
      },
      {
        type: 'note',
        label: 'Notes',
        options: []
      } as FilterTypeWithOptions
    )
    const rankedTags = todoTags.reduce((acc, tag) => {
      if (!acc[tag]) {
        acc[tag] = 1
      } else {
        acc[tag] += 1
      }
      return acc
    }, {} as { [tag: string]: number })

    const tagFilters = tags.reduce(
      (acc, c) => {
        const rank = rankedTags[c.value] ?? 0
        const tag = c.value
        // const [tag, rank] = c
        if (rank >= 0) {
          acc.options.push({
            id: `filter_tag_${tag}`,
            label: tag,
            value: tag,
            count: rank
          })
        }
        return acc
      },
      {
        type: 'tag',
        label: 'Tags',
        options: []
      } as FilterTypeWithOptions
    )

    const rankedMentions = todoMentions.reduce((acc, mention) => {
      if (!acc[mention]) {
        acc[mention] = 1
      } else {
        acc[mention] += 1
      }
      return acc
    }, {} as { [mention: string]: number })

    const mentionFilters = Object.entries(rankedMentions).reduce(
      (acc, c) => {
        const [mention, rank] = c
        if (rank >= 0) {
          acc.options.push({
            id: `mention_${mention}`,
            label: getUserFromUserid(mention)?.alias ?? mention,
            value: mention,
            count: rank
          })
        }
        return acc
      },
      {
        type: 'mention',
        label: 'Mentions',
        options: []
      } as FilterTypeWithOptions
    )

    // Namespace Filters
    const rankedNamespaces = todoNodes.reduce((acc, item) => {
      const node = getILinkFromNodeid(item)
      if (!node) return acc
      const namespace = node.namespace
      // const allPaths = getAllParentIds(path)
      // const allPaths =
      if (acc[namespace]) {
        acc[namespace] += 1
      } else {
        acc[namespace] = 1
      }
      return acc
    }, {} as { [path: string]: number })

    const namespaceFilters = namespaces.reduce(
      (acc, namespace) => {
        const rank = rankedNamespaces[namespace.id] ?? 0
        const namespaceID = namespace.id
        if (rank >= 1 && namespace) {
          acc.options.push({
            id: `namespace_${namespaceID}`,
            label: namespace.name,
            value: namespaceID,
            count: rank
          })
        }
        return acc
      },
      {
        type: 'space',
        label: 'Spaces',
        options: []
      } as FilterTypeWithOptions
    )

    const allFilters = [nodeFilters, tagFilters, mentionFilters, namespaceFilters]
    mog('allFilters for tasks', { board, todoTags, rankedTags, rankedPaths, nodeFilters })
    return allFilters
  }

  const getTodoBoard = () => {
    const nodetodos = useTodoStore.getState().todos
    const extra = getSearchExtra()
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
        .filter((todo) =>
          currentFilters.length > 0
            ? globalJoin === 'all'
              ? currentFilters.every((filter) => taskFilterFunctions[filter.type](todo, filter))
              : currentFilters.some((filter) => taskFilterFunctions[filter.type](todo, filter))
            : true
        )
        .filter((todo) => {
          // TODO: Find a faster way to check for empty content // May not need to convert content to raw text
          const text = convertContentToRawText(todo.content, ' ', { extra }).trim()
          // mog('empty todo check', { text, nodeid, todo })
          if (text === '') {
            return false
          }
          if (todo.content === defaultContent.content) return false
          return true
        })
        .forEach((todo) => {
          todoBoard.columns
            .find((column) => column.id === todo?.metadata?.status)
            ?.cards.push({
              id: `KANBAN_ID_${todo.nodeid}_${todo.id}`,
              todo: todo
            })
        })
    })

    // mog('getTodoBoard', { nodetodos, todoBoard })

    const todoFilters = generateTodoFilters(todoBoard)
    setFilters(todoFilters)

    todoBoard.columns.forEach((column) => {
      column.cards.sort((a, b) => {
        if (TodoRanks[a.todo?.metadata?.priority] < TodoRanks[b.todo?.metadata?.priority]) return 1
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

  const addCurrentFilter = (filter: Filter) => {
    setCurrentFilters([...currentFilters, filter])
  }

  const removeCurrentFilter = (filter: Filter) => {
    setCurrentFilters(currentFilters.filter((f) => f.id !== filter.id))
  }

  const changeCurrentFilter = (filter: Filter) => {
    setCurrentFilters(currentFilters.map((f) => (f.id === filter.id ? filter : f)))
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
    changeCurrentFilter,
    resetCurrentFilters,
    resetFilters,
    filters,
    currentFilters,
    setCurrentFilters,
    globalJoin,
    setGlobalJoin
  }
}
