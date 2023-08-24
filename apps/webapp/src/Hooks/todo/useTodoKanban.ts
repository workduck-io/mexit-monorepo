import { SearchResult } from '@workduck-io/mex-search'

import { PriorityType, TodoStatus } from '@mexit/core'

import { KanbanBoard, KanbanCard, KanbanColumn } from '../../Types/Kanban'

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

export const useTodoKanban = () => {
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
    getBlocksBoard
  }
}
