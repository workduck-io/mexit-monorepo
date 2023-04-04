import React, { useMemo } from 'react'

import { UniqueIdentifier } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { useTreeStore } from '@mexit/core'

import { SortableTreeItem } from './components'
import type { TreeItems } from './types'
import { flattenTree, removeChildrenOf, removeItem, setProperty } from './utilities'

interface Props {
  collapsible?: boolean
  items?: TreeItems
  setItems: any
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
  items = [],
  setItems,
  indicator = false,
  activeId,
  indentationWidth = 20,
  onClick,
  onContextMenu,
  highlightedId,
  removable
}: Props) => {
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
      {flattenedItems.map(({ id, children, properties, isStub, collapsed, depth }) => (
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
          isStub={isStub}
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
