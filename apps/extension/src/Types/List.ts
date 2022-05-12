import { ActionType, CategoryType, QuickLinkType, Shortcut } from '@mexit/core'

export interface ListItemType {
  id: string
  icon: string
  title: string
  description?: string
  type?: ActionType
  category: QuickLinkType
  shortcut?: Record<string, Shortcut>
  extras?: Partial<ItemExtraType>
}

export interface ItemExtraType {
  nodeid: string
  blockid: string
  path: string
  // New Note
  new: boolean
  // New Task
  newTask: boolean
  combo: boolean
  customAction: () => void
  componentName: string
  base_url: string
}
