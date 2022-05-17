import { CategoryType, QuickLinkType } from './Editor'
import { Shortcut } from './Help'

export enum ActionType {
  SEARCH = 'Search Action',
  OPEN = 'Open Link',
  RENDER = 'Render Action',
  BROWSER_EVENT = 'Browser Action',
  SCREENSHOT = 'Screenshot Action'
}

export interface MexitAction {
  id: string
  title: string
  description?: string
  type?: ActionType
  category: QuickLinkType
  icon?: string
  shortcut?: Record<string, Shortcut>
  data?: any
  extras?: any
  metadata?: any
}
