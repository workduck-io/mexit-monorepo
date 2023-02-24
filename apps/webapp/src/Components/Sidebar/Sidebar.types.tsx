import { ILink, LastOpenedState, MIcon, SingleNamespace, Tag } from '@mexit/core'
import { DesignItem } from '@mexit/shared'

import { PollActions } from '../../Stores/useApiStore'

/**
 * A generic item to be shown in sidebar
 */
export interface FlatSidebarItem extends DesignItem {
  // Used to calculate the last opened state once in the list item component
  lastOpenedId?: string

  // Used to pass the state computed to the context menu
  lastOpenedState?: LastOpenedState
}

export interface SidebarFlatList {
  type: 'flat'
  renderItems: () => JSX.Element
}
export interface SidebarNestedList {
  type: 'hierarchy'
  items: ILink[]
}

export type SidebarMainList = SidebarFlatList | SidebarNestedList

type NewType = PollActions

/**
 * A single namespace to be shown in the sidebar
 */
export interface SidebarSpace {
  /**
   * ID of the space
   */
  id: string

  /**
   * Icon of the space
   */
  icon: MIcon

  /**
   * Label of the space
   */
  label: string

  /**
   * Tooltip on hovering over the space icon in space switcher
   */
  tooltip?: string

  /**
   * Shortcut to navigate to the space
   */
  shortcut?: string

  /**
   * The main list content of a space
   */
  list: SidebarMainList

  data: SingleNamespace

  /**
   * Default Item for a space
   * Shown before the pinned items
   */
  defaultItem?: FlatSidebarItem

  /**
   * Items of a space that have been pinned
   */
  pinnedItems?: () => JSX.Element

  /**
   * Tags that have been used most often in a given space
   */
  popularTags?: Tag[]

  /**
   * If provided the polling action is added to the poll hook
   * when the space is opened
   */
  pollAction?: NewType
}
