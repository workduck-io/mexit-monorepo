export interface KanbanCard {
  id: string
}

export interface KanbanColumn {
  id: string
  title: string
  cards: KanbanCard[]
}

export interface KanbanBoard {
  columns: KanbanColumn[]
}
