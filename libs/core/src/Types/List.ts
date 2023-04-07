import { ActionType } from './Actions'
import { QuickLinkType } from './Editor'
import { Shortcut } from './Help'
import { MIcon } from './Store'

export interface ListItemType {
  id: string
  icon: MIcon
  title: string
  description?: string
  type?: ActionType
  category: QuickLinkType
  shortcut?: Record<string, Shortcut>
  extras?: Partial<ItemExtraType>
}

export interface MenuListItemType {
  id: string
  label: string
  disabled?: boolean
  icon?: MIcon
  onSelect: any
  options?: Array<MenuListItemType>
}

export interface ItemExtraType {
  nodeid: string
  blockid: string
  path: string
  withinMex?: boolean
  newItemType?: 'snippet' | 'task' | 'note'
  // New Note
  new: boolean
  // New Task
  newTask: boolean
  combo: boolean
  customAction: () => void
  componentName: string
  base_url: string
  // browser actions
  event_name: string
}
