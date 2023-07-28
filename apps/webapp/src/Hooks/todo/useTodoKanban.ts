import { ELEMENT_TODO_LI } from '@udecode/plate'

import { SearchResult } from '@workduck-io/mex-search'

import { PriorityType, TodoStatus, TodoType, useTodoStore } from '@mexit/core'

import { defaultContent } from '../../Data/baseData'
import { PropertiyFields } from '../../Editor/Components/SuperBlock/SuperBlock.types'
import useUpdateBlock from '../../Editor/Hooks/useUpdateBlock'
import { KanbanBoard, KanbanCard, KanbanColumn } from '../../Types/Kanban'
import { useSearch } from '../useSearch'

export interface TodoKanbanCard extends KanbanCard {
  todoid: string
  nodeid: string
  status: TodoStatus
  priority: PriorityType
}

export interface KanbanBoardColumn extends KanbanColumn {
  id: string
  cards: SearchResult[]
}

export interface BlockKanbanBoard extends KanbanBoard {
  columns: KanbanBoardColumn[]
}

export const getPureContent = (todo: TodoType) => {
  const content = todo?.content

  if (content?.length > 0) {
    if (content[0].type !== ELEMENT_TODO_LI) return content
    else return content[0].children
  }
  return defaultContent?.content
}

export const useTodoKanban = () => {
  const updateTodo = useTodoStore((s) => s.updateTodoOfNode)
  const moveTodoInStore = useTodoStore((s) => s.moveTodo)

  const { updateBlocks } = useSearch()
  const { setInfoOfBlockInContent } = useUpdateBlock()

  const updateTodoLocally = (todo: TodoType, properties: Partial<PropertiyFields>) => {
    const newTodo = { ...todo, properties: { ...todo.properties, ...properties } }
    updateTodo(todo.nodeid, newTodo)

    const updatedBlock = setInfoOfBlockInContent(todo.nodeid, {
      blockId: todo.id,
      properties,
      useBuffer: true
    })

    if (updatedBlock) {
      updateBlocks({
        id: todo.nodeid,
        contents: [updatedBlock]
      })
    }
  }

  const changeStatus = (todo: TodoType, newStatus: TodoStatus) => {
    updateTodoLocally(todo, { status: newStatus })
  }

  const changePriority = (todo: TodoType, newPriority: PriorityType) => {
    updateTodoLocally(todo, { priority: newPriority })
  }

  const moveTodo = (todoId: string, fromId: string, toId: string) => {
    moveTodoInStore(todoId, fromId, toId)
  }

  const getBlocksBoard = (groupedItems: Record<string, Array<SearchResult>>) => {
    const fromItems = Object.entries(groupedItems).map(([key, items]) => {
      return {
        id: key,
        title: key,
        cards: items
      }
    })

    const board: BlockKanbanBoard = {
      columns: fromItems
    }

    return board
  }

  return {
    moveTodo,
    updateTodoLocally,
    getPureContent,
    getBlocksBoard,
    changePriority,
    changeStatus
  }
}
