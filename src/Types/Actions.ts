export enum ActionType {
  'SEARCH',
  'OPEN',
  'RENDER',
  'BROWSER_EVENT'
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
