import type { MutableRefObject } from 'react'

import { UniqueIdentifier } from '@dnd-kit/core'

export interface TreeItem {
  id: UniqueIdentifier
  children: TreeItem[]
  collapsed?: boolean
  properties?: Record<string, any>
}

export type TreeItems = TreeItem[]

export interface FlattenedItem extends TreeItem {
  parentId: UniqueIdentifier | null
  depth: number
  index: number
}

export type SensorContext = MutableRefObject<{
  items: FlattenedItem[]
  offset: number
}>
