import React, { forwardRef, HTMLAttributes } from 'react'

import fileList2Line from '@iconify/icons-ri/file-list-2-line'
import { Icon } from '@iconify/react'
import Tippy from '@tippyjs/react'

import {
  ItemContent,
  ItemCount,
  ItemTitle,
  StyledTreeItem,
  StyledTreeItemSwitcher,
  StyledTreeSwitcher,
  TooltipContentWrapper
} from '@workduck-io/mex-components'

import { MIcon } from '@mexit/core'
import { ItemTitleText } from '@mexit/shared'

import { getTitleFromPath } from '../../../Hooks/useLinks'
import { useAnalysisStore } from '../../../Stores/useAnalysis'

import { TreeItem } from './types'

export const TooltipContent = ({ nodeId, path }: { nodeId: string; path: string }) => {
  const title = getTitleFromPath(path)

  return (
    <TooltipContentWrapper>
      {title}
      {/* {IS_DEV && ' ' + .nodeid} */}
      {/* {item?.data?.tasks !== undefined && item.data.tasks > 0 && (
        <TooltipCount>
          <Icon icon="ri:task-line" />
          {item?.data?.tasks}
        </TooltipCount>
      )} */}
      {/* {item?.data?.reminders !== undefined && item.data.reminders > 0 && (
        <TooltipCount>
          <Icon icon="ri:timer-flash-line" />
          {item?.data?.reminders}
        </TooltipCount>
      )} */}
    </TooltipContentWrapper>
  )
}

const ItemTitleWithAnalysis = ({ nodeId, icon, path }: { nodeId: string; icon?: MIcon; path: string }) => {
  const anal = useAnalysisStore((state) => state.analysis)
  const title =
    anal?.nodeid && anal?.nodeid === nodeId && anal?.title !== undefined && anal?.title !== ''
      ? anal?.title
      : getTitleFromPath(path)

  return (
    <ItemTitle>
      <Icon icon={icon?.value ?? fileList2Line} />
      <ItemTitleText>{title}</ItemTitleText>
    </ItemTitle>
  )
}

interface GetIconProps {
  id: string
  childCount: number
  onCollapse?: (itemId: string) => void
}

export const GetIcon = ({ id, childCount, onCollapse }: GetIconProps) => {
  if (childCount > 0) {
    return (
      <StyledTreeItemSwitcher onClick={() => onCollapse(id)}>
        {onCollapse ? <Icon icon={'ri:arrow-down-s-line'} /> : <Icon icon={'ri:arrow-right-s-line'} />}
      </StyledTreeItemSwitcher>
    )
  }
  return <StyledTreeSwitcher></StyledTreeSwitcher>
}

export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {
  data: TreeItem['data']
  target: any
  childCount?: number
  clone?: boolean
  collapsed?: boolean
  depth: number
  disableInteraction?: boolean
  disableSelection?: boolean
  ghost?: boolean
  handleProps?: any
  indicator?: boolean
  indentationWidth: number
  value: string
  onCollapse?(): void
  onRemove?(): void
  wrapperRef?(node: HTMLDivElement): void
}

// eslint-disable-next-line react/display-name
export const RenderTreeItem = forwardRef<HTMLDivElement, Props>(
  (
    {
      data,
      childCount,
      clone,
      depth,
      disableSelection,
      disableInteraction,
      ghost,
      target,
      handleProps,
      indentationWidth,
      indicator,
      collapsed,
      onCollapse,
      onRemove,
      style,
      value,
      wrapperRef,
      ...props
    },
    ref
  ) => {
    return (
      <Tippy
        theme="mex"
        placement="right"
        singleton={target}
        content={<TooltipContent path={data.path} nodeId={data.nodeId} />}
      >
        <span>
          {/* <ContextMenu.Root
          onOpenChange={(open) => {
            if (open) {
              mog('Context Menu open')
            } else {
              mog('Context menu close')
            }
          }}
        > */}
          {/* <ContextMenu.Trigger asChild> */}
          <div ref={wrapperRef}>
            <StyledTreeItem ref={ref}>
              <GetIcon id={data.nodeId} childCount={childCount} onCollapse={onCollapse} />
              <ItemContent {...handleProps}>
                <ItemTitleWithAnalysis nodeId={data.nodeId} path={data.path} icon={data?.icon} />
              </ItemContent>

              <TreeItemMetaInfo childCount={childCount} />
            </StyledTreeItem>
          </div>
          {/* </ContextMenu.Trigger> */}
          {/* <TreeContextMenu item={{ data: { ...data } }} /> */}
          {/* </ContextMenu.Root> */}
        </span>
      </Tippy>
    )
  }
)

const TreeItemMetaInfo = ({ childCount }: { childCount: number }) => {
  return childCount > 0 && <ItemCount>{childCount}</ItemCount>
}
