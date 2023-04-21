import { QuickLinkType } from './Editor'
import { Shortcut } from './Help'
import { MIcon } from './Store'

export enum ActionType {
  SEARCH = 'Search Action',
  OPEN = 'Open Link',
  USE = 'Search using',
  RENDER = 'Render Action',
  TOGGLE = 'Toggle Action',
  BROWSER_EVENT = 'Browser Action',
  SCREENSHOT = 'Screenshot Action',
  HIGHLIGHT = 'Highlight',
  MAGICAL = 'Smart Capture',
  RIGHT_SIDEBAR = 'Right Sidebar Action',
  LOREM_IPSUM = 'lorem ipsum generator',
  AVATAR_GENERATOR = 'Generate random avatar from dicebear'
}

export interface MexitAction {
  id: string
  title: string
  description?: string
  type?: ActionType
  category: QuickLinkType
  icon?: MIcon
  shortcut?: Record<string, Shortcut>
  data?: any
  extras?: any
  metadata?: any
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ActionGroup {
  actionGroupId: string
  name: string
  description: string
  icon: string
  permissions?: string
  globalActionId?: string
  authConfig: any
  tag?: string
}

export type ActionGroupType = ActionGroup & { connected?: boolean }

export type AppsType = Record<string, ActionGroupType>

export type PortalType = {
  serviceId: string
  serviceType: string
  mexId?: string
  nodeId?: string
  parentNodeId?: string
  namespaceId?: string
  sessionStartTime?: number
}
