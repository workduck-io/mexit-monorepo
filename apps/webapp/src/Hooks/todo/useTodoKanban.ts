import { ELEMENT_TODO_LI } from '@udecode/plate'

import {
  convertContentToRawText,
  Filter,
  FilterTypeWithOptions,
  getAllParentIds,
  mog,
  PriorityType,
  SNIPPET_PREFIX,
  TodoStatus,
  TodosType,
  TodoType
} from '@mexit/core'

import { defaultContent } from '../../Data/baseData'
import useUpdateBlock from '../../Editor/Hooks/useUpdateBlock'
import { useDataStore } from '../../Stores/useDataStore'
import { useTodoStore } from '../../Stores/useTodoStore'
import { KanbanBoard, KanbanCard, KanbanColumn } from '../../Types/Kanban'
import { taskSortFunctions, useTaskFilterFunctions } from '../useFilterFunctions'
import { useLinks } from '../useLinks'
import { useMentions } from '../useMentions'
import { useNodes } from '../useNodes'
import { useSearchExtra } from '../useSearch'

import { useTodoFilterStore } from './useTodoFilters'

export interface TodoKanbanCard extends KanbanCard {
  todoid: string
  nodeid: string
  status: TodoStatus
  priority: PriorityType
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

export const useTodoKanban = () => {
  const setFilters = useTodoFilterStore((s) => s.setFilters)
  const globalJoin = useTodoFilterStore((state) => state.globalJoin)
  const sortOrder = useTodoFilterStore((state) => state.sortOrder)
  const sortType = useTodoFilterStore((state) => state.sortType)

  const updateTodo = useTodoStore((s) => s.updateTodoOfNode)
  const tags = useDataStore((state) => state.tags)
  const ilinks = useDataStore((state) => state.ilinks)
  const namespaces = useDataStore((state) => state.namespaces)

  const { setInfoOfBlockInContent } = useUpdateBlock()
  const { getPathFromNodeid, getILinkFromNodeid } = useLinks()
  const { isInArchive } = useNodes()
  const { getSearchExtra } = useSearchExtra()
  const { getUserFromUserid } = useMentions()
  const taskFilterFunctions = useTaskFilterFunctions()

  const updateTodoLocally = (todo: TodoType, blockData: any) => {
    updateTodo(todo.nodeid, { ...todo, metadata: { ...todo.metadata, ...blockData } })
    setInfoOfBlockInContent(todo.nodeid, {
      blockId: todo.id,
      blockData,
      useBuffer: true
    })
  }

  const changeStatus = (todo: TodoType, newStatus: TodoStatus) => {
    updateTodoLocally(todo, { status: newStatus })
  }

  const changePriority = (todo: TodoType, newPriority: PriorityType) => {
    updateTodoLocally(todo, { priority: newPriority })
  }

  const generateTodoFilters = (nodeTodos: TodosType) => {
    // Nodes and tags
    const todoNodes: string[] = []
    const todoTags: string[] = []
    const todoMentions: string[] = []
    const todoStatuses: TodoStatus[] = []

    Object.values(nodeTodos)
      .flat()
      .forEach((todo) => {
        // Use tags of the tag
        const tags = todo.tags
        todoNodes.push(todo.nodeid)
        todoTags.push(...(tags ?? []))
        todoMentions.push(...(todo.mentions ?? []))
        todoStatuses.push(todo.metadata?.status)
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
            id: ilink.nodeid,
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

    const rankedStatuses = todoStatuses.reduce((acc, status) => {
      if (!acc[status]) {
        acc[status] = 1
      } else {
        acc[status] += 1
      }
      return acc
    }, {} as { [tag: string]: number })

    const statusFilters = (Object.keys(TodoStatus) as Array<keyof typeof TodoStatus>).reduce(
      (acc, c) => {
        const rank = rankedStatuses[c] ?? 0
        const status = c
        // const [tag, rank] = c
        if (rank >= 0) {
          acc.options.push({
            id: `filter_status_${status}`,
            label: status,
            value: status,
            count: rank
          })
        }
        return acc
      },
      {
        type: 'status',
        label: 'Status',
        options: []
      } as FilterTypeWithOptions
    )

    const allFilters = [nodeFilters, tagFilters, mentionFilters, namespaceFilters, statusFilters]
    mog('allFilters for tasks', { todoTags, rankedTags, rankedPaths, nodeFilters, rankedStatuses, statusFilters })
    return allFilters
  }

  const getFilteredTodoBoard = (appliedFilters: Filter[]) => {
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
    Object.entries(nodetodos).forEach(([nodeid, todos]) => {
      if (nodeid.startsWith(SNIPPET_PREFIX)) return
      if (isInArchive(nodeid)) return
      todos
        .filter((todo) =>
          appliedFilters.length > 0
            ? globalJoin === 'all'
              ? appliedFilters.every((filter) => taskFilterFunctions[filter.type](todo, filter))
              : appliedFilters.some((filter) => taskFilterFunctions[filter.type](todo, filter))
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
              todoid: todo.id,
              nodeid: todo.nodeid,
              status: todo?.metadata?.status,
              priority: todo?.metadata?.priority
            })
        })
    })

    // mog('getTodoBoard', { nodetodos, todoBoard })

    if (sortOrder && sortType) {
      todoBoard.columns.forEach((column) => {
        column.cards.sort(taskSortFunctions[sortType])
        if (sortOrder === 'descending') {
          column.cards.reverse()
        }
      })
    }

    return todoBoard
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
    const currentFilters = useTodoFilterStore.getState().currentFilters
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
              todoid: todo.id,
              nodeid: todo.nodeid,
              status: todo?.metadata?.status,
              priority: todo?.metadata?.priority
            })
        })
    })

    // mog('getTodoBoard', { nodetodos, todoBoard })

    const todoFilters = generateTodoFilters(nodetodos)
    setFilters(todoFilters)

    // Reimplement sorting
    if (sortOrder && sortType) {
      todoBoard.columns.forEach((column) => {
        column.cards.sort(taskSortFunctions[sortType])
        if (sortOrder === 'descending') {
          column.cards.reverse()
        }
      })
    }

    // todoBoard.columns.sort((a, b) => {
    //   if (TodoStatusRanks[a.id] > TodoStatusRanks[b.id]) return 1
    //   else return -1
    // })

    return todoBoard
  }

  return {
    getPureContent,
    getTodoBoard,
    changePriority,
    changeStatus,
    getFilteredTodoBoard
  }
}
