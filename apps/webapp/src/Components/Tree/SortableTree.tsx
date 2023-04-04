import React, { useMemo, useState } from 'react'

import { UniqueIdentifier } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { useTreeStore } from '@mexit/core'

import { SortableTreeItem } from './components'
import type { TreeItems } from './types'
import { flattenTree, removeChildrenOf, removeItem, setProperty } from './utilities'

interface Props {
  collapsible?: boolean
  defaultItems?: TreeItems
  indentationWidth?: number
  onContextMenu?: any
  highlightedId?: UniqueIdentifier | undefined
  indicator?: boolean
  activeId?: UniqueIdentifier | undefined
  onClick: (id: UniqueIdentifier) => void
  removable?: boolean
}

export const SortableTree = ({
  collapsible,
  defaultItems = [],
  indicator = false,
  activeId,
  indentationWidth = 20,
  onClick,
  onContextMenu,
  highlightedId,
  removable
}: Props) => {
  const [items, setItems] = useState(defaultItems)
  const expandNode = useTreeStore((state) => state.expandNode)
  const collapseNode = useTreeStore((state) => state.collapseNode)

  const flattenedItems = useMemo(() => {
    const flattenedTree = flattenTree(items)
    const collapsedItems = flattenedTree.reduce<UniqueIdentifier[]>(
      (acc, { children, collapsed, id }) => (collapsed && children.length ? [...acc, id] : acc),
      []
    )

    return removeChildrenOf(flattenedTree, collapsedItems)
  }, [items])

  const sortedIds = useMemo(() => flattenedItems.map(({ id }) => id), [flattenedItems])

  return (
    <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
      {flattenedItems.map(({ id, children, properties, collapsed, depth }) => (
        <SortableTreeItem
          key={id}
          id={id}
          value={{
            id,
            properties
          }}
          depth={depth}
          highlightedId={highlightedId}
          indentationWidth={indentationWidth}
          indicator={indicator}
          childCount={children.length}
          collapsed={Boolean(collapsed && children.length)}
          onCollapse={collapsible && children.length ? () => handleCollapse(id) : undefined}
          activeId={activeId}
          onClick={() => {
            onClick(id)
          }}
          onContextMenu={onContextMenu}
          onRemove={removable ? () => handleRemove(id) : undefined}
        />
      ))}
    </SortableContext>
  )

  function handleRemove(id: UniqueIdentifier) {
    setItems((items) => removeItem(items, id))
  }

  function handleCollapse(id: UniqueIdentifier) {
    setItems((items) =>
      setProperty(items, id, 'collapsed', (value) => {
        if (!value) collapseNode(id as any)
        else expandNode(id as any)

        return !value
      })
    )
  }
}
