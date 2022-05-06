import { CategoryType } from './Editor'

export const ActionType: any = {
  SEARCH: 'SEARCH',
  OPEN: 'OPEN',
  RENDER: 'RENDER',
  BROWSER_EVENT: 'BROWSER_EVENT',
  SCRENSHOT: 'SCREENSHOT'
}

export interface MexitAction {
  id: string
  title: string
  description?: string
  type: string
  category: CategoryType
  shortcut?: string[]
  data?: any
  metadata?: any
}
