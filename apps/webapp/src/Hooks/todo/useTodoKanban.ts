import { ELEMENT_TODO_LI } from '@udecode/plate'

import { SearchResult } from '@workduck-io/mex-search'

import { PriorityType, TodoStatus, TodoType, useTodoStore } from '@mexit/core'

import { defaultContent } from '../../Data/baseData'
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

// interface KanbanStore extends FilterStore<TodoType> {}

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

  const { updateBlocks } = useSearch()
  const { setInfoOfBlockInContent } = useUpdateBlock()

  const updateTodoLocally = (todo: TodoType, blockData: any) => {
    const newTodo = { ...todo, metadata: { ...todo.metadata, ...blockData } }
    updateTodo(todo.nodeid, newTodo)
    const updatedBlock = setInfoOfBlockInContent(todo.nodeid, {
      blockId: todo.id,
      blockData,
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

  const getBlocksBoard = (groupedItems: Record<string, Array<SearchResult>>) => {
    const board: BlockKanbanBoard = {
      columns: Object.entries(groupedItems).map(([key, items]) => {
        return {
          id: key,
          title: key,
          cards: items
        }
      })
    }

    return board
  }

  return {
    getPureContent,
    getBlocksBoard,
    changePriority,
    changeStatus
  }
}
