import React, { CSSProperties } from 'react'

import { AnimateLayoutChanges, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { RenderTreeItem, TreeItemProps } from './TreeItem'
import { iOS } from './utilities'

interface Props extends TreeItemProps {
  id: string
}

const animateLayoutChanges: AnimateLayoutChanges = ({ isSorting, wasDragging }) =>
  isSorting || wasDragging ? false : true

export function SortableTreeItem({ id, depth, onClick, ...props }: Props) {
  const {
    attributes,
    isDragging,
    isSorting,
    listeners,
    setDraggableNodeRef,
    setDroppableNodeRef,
    transform,
    transition
  } = useSortable({
    id,
    animateLayoutChanges
  })
  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition
  }

  return (
    <RenderTreeItem
      ref={setDraggableNodeRef}
      wrapperRef={setDroppableNodeRef}
      // style={style}
      depth={depth}
      ghost={isDragging}
      disableSelection={iOS}
      disableInteraction={isSorting}
      onClick={onClick}
      handleProps={{
        ...attributes,
        ...listeners
      }}
      {...props}
    />
  )
}
