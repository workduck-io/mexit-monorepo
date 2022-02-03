export enum ActionType {
  'search',
  'open',
  'render',
  'action',
  'browser_search'
}

export interface MexitAction {
  id: string
  title: string
  description?: string
  type: ActionType
  shortcut?: string[]
  data?: any
  metadata?: any
}
