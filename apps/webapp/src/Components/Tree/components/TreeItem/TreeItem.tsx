import React, { forwardRef, HTMLAttributes } from 'react'

import { UniqueIdentifier } from '@dnd-kit/core'
import arrowLeftSLine from '@iconify/icons-ri/arrow-down-s-line'

import {
  DefaultMIcons,
  Group,
  IconDisplay,
  ItemContent,
  ItemTitle,
  ItemTitleText,
  StyledTreeItemSwitcher,
  StyledTreeSwitcher
} from '@mexit/shared'

import { Chevron } from '../../../Views/ViewBlockRenderer/BlockContainer'
import { FlattenedItem } from '../../types'

import { TreeListItem } from './styled'

export interface Props extends Omit<HTMLAttributes<HTMLLIElement>, 'id'> {
  childCount?: number
  clone?: boolean
  collapsed?: boolean
  isStub?: boolean
  depth: number
  disableInteraction?: boolean
  disableSelection?: boolean
  ghost?: boolean
  handleProps?: any
  activeId: UniqueIdentifier | undefined
  highlightedId: UniqueIdentifier | undefined
  indicator?: boolean
  indentationWidth: number
  value: Partial<FlattenedItem>
  onCollapse?(): void
  onClick?: () => void
  onRemove?(): void
  wrapperRef?(node: HTMLLIElement): void
  onContextMenu?: any
}

export const TreeItem = forwardRef<HTMLDivElement, Props>(
  (
    {
      childCount,
      isStub,
      clone,
      depth,
      disableSelection,
      disableInteraction,
      ghost,
      handleProps,
      onContextMenu,
      indentationWidth,
      indicator,
      collapsed,
      onCollapse,
      onRemove,
      style,
      value,
      children,
      activeId,
      highlightedId,
      wrapperRef,
      ...props
    },
    ref
  ) => {
    return (
      <TreeListItem
        clone={clone}
        ghost={ghost}
        isHighlighted={value.id === highlightedId}
        indicator={indicator}
        isStub={isStub}
        active={value.id === activeId}
        disableSelection={!!disableSelection}
        onContextMenu={(e) => {
          e.preventDefault()
          if (onContextMenu) onContextMenu(value.id, e)
        }}
        disableInteraction={!!disableInteraction}
        ref={wrapperRef}
        style={
          {
            '--spacing': `${indentationWidth * depth}px`
          } as React.CSSProperties
        }
        {...props}
      >
        <Group>
          {childCount > 0 ? (
            <StyledTreeItemSwitcher
              onClick={(e) => {
                e.stopPropagation()
                onCollapse()
              }}
            >
              <Chevron cursor="pointer" height={18} width={18} icon={arrowLeftSLine} isOpen={collapsed} />
            </StyledTreeItemSwitcher>
          ) : (
            <StyledTreeSwitcher />
          )}
          <ItemContent>
            <ItemTitle>
              <IconDisplay className="defaultIcon" size={18} icon={DefaultMIcons.VIEW} />
              <ItemTitleText>{value.properties.label}</ItemTitleText>
            </ItemTitle>
          </ItemContent>
        </Group>
      </TreeListItem>
    )
  }
)

TreeItem.displayName = 'TreeItem'
