import { QuickLinkType } from './Editor'
import { Shortcut } from './Help'

export enum ActionType {
  SEARCH = 'Search Action',
  OPEN = 'Open Link',
  USE = 'Search using',
  RENDER = 'Render Action',
  BROWSER_EVENT = 'Browser Action',
  SCREENSHOT = 'Screenshot Action',
  MAGICAL = 'Smart Capture',
  RIGHT_SIDEBAR = 'Right Sidebar Action',
  LOREM_IPSUM = 'lorem ipsum generator'
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
