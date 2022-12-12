import type { MutableRefObject } from 'react'

import { MIcon } from '@mexit/core'

export interface TreeItem {
  id: string
  children: TreeItem[]
  collapsed?: boolean
  data: {
    nodeId: string
    path: string
    namespace: string
    icon?: MIcon
  }
}

export type TreeItems = TreeItem[]

export interface FlattenedItem extends TreeItem {
  parentId: string
  depth: number
  index: number
}

export type SensorContext = MutableRefObject<{
  items: FlattenedItem[]
  offset: number
}>
