import { CategoryType } from './Editor'
import { Shortcut } from './Help'

export enum ActionType {
  SEARCH,
  OPEN,
  RENDER,
  BROWSER_EVENT,
  SCREENSHOT
}

export interface MexitAction {
  id: string
  title: string
  description?: string
  type: ActionType
  category: CategoryType
  icon?: string
  shortcut?: Record<string, Shortcut>
  data?: any
  metadata?: any
}
