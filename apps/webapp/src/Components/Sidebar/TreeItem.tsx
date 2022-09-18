import React, { useMemo } from 'react'

import { ItemId, RenderItemParams, TreeItem } from '@atlaskit/tree'
import checkboxBlankCircleFill from '@iconify/icons-ri/checkbox-blank-circle-fill'
import fileList2Line from '@iconify/icons-ri/file-list-2-line'
// import { complexTree } from '../mockdata/complexTree'
import PinIcon from '@iconify/icons-ri/pushpin-2-fill'
import { Icon } from '@iconify/react'
import * as ContextMenu from '@radix-ui/react-context-menu'
import Tippy from '@tippyjs/react'
import { PathMatch } from 'react-router-dom'

import { IS_DEV } from '@mexit/core'
import {
  ItemContent,
  ItemCount,
  ItemTitle,
  ItemTitleText,
  StyledTreeItem,
  StyledTreeItemSwitcher,
  StyledTreeSwitcher,
  TooltipContentWrapper,
  TooltipCount,
  UnreadIndicator
} from '@mexit/shared'

import { useAnalysisStore } from '../../Stores/useAnalysis'
import useMultipleEditors from '../../Stores/useEditorsStore'
import { LastOpenedState } from './SidebarList'
import { TreeContextMenu } from './TreeWithContextMenu'

const defaultSnap = {
  isDragging: false,
  isDropAnimating: false,
  dropAnimation: null,
  mode: null,
  draggingOver: null,
  combineTargetFor: null,
  combineWith: null
}

export const TooltipContent = ({ item }: { item: TreeItem }) => {
  // console.log('TooltipContent', { item, IS_DEV })
  return (
    <TooltipContentWrapper>
      {item?.data?.title}
      {IS_DEV && ' ' + item?.data?.nodeid}
      {item?.data?.tasks !== undefined && item.data.tasks > 0 && (
        <TooltipCount>
          <Icon icon="ri:task-line" />
          {item?.data?.tasks}
        </TooltipCount>
      )}
      {item?.data?.reminders !== undefined && item.data.reminders > 0 && (
        <TooltipCount>
          <Icon icon="ri:timer-flash-line" />
          {item?.data?.reminders}
        </TooltipCount>
      )}
    </TooltipContentWrapper>
  )
}

const ItemTitleWithAnalysis = ({ item }: { item: TreeItem }) => {
  const anal = useAnalysisStore((state) => state.analysis)
  const title =
    anal.nodeid && anal.nodeid === item.data.nodeid && anal.title !== undefined && anal.title !== ''
      ? anal.title
      : item.data
      ? item.data.title
      : 'NoTitle'

  return (
    <ItemTitle>
      <Icon icon={item.data.mex_icon ?? fileList2Line} />
      <ItemTitleText>{title}</ItemTitleText>
    </ItemTitle>
  )
}

interface GetIconProps {
  item: TreeItem
  onExpand: (itemId: ItemId) => void
  onCollapse: (itemId: ItemId) => void
}

export const GetIcon = ({ item, onCollapse, onExpand }: GetIconProps) => {
  if (item.children && item.children.length > 0) {
    return item?.isExpanded ? (
      <StyledTreeItemSwitcher onClick={() => onCollapse(item.id)}>
        <Icon icon={'ri:arrow-down-s-line'} />
      </StyledTreeItemSwitcher>
    ) : (
      <StyledTreeItemSwitcher onClick={() => onExpand(item.id)}>
        <Icon icon={'ri:arrow-right-s-line'} />
      </StyledTreeItemSwitcher>
    )
  }
  return <StyledTreeSwitcher></StyledTreeSwitcher>
}

interface TreeItemProps extends RenderItemParams {
  target: any
  contextOpenNodeId: string
  isInEditor: boolean
  match: PathMatch<'nodeid'>
  isHighlighted: boolean
  setContextOpenNodeId: (nodeid: string | null) => void
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: TreeItem) => void
}

export const RenderTreeItem = ({
  item,
  onExpand,
  onCollapse,
  provided,
  snapshot,
  target,
  contextOpenNodeId,
  setContextOpenNodeId,
  isInEditor,
  isHighlighted,
  match,
  onClick
}: TreeItemProps) => {
  const isTrue = JSON.stringify(snapshot) !== JSON.stringify(defaultSnap)

  // const lastOpenedNote = useUserPreferenceStore((state) => state.lastOpenedNotes[item?.data?.nodeid])
  // const { getLastOpened } = useLastOpened()

  // const lastOpenedState = useMemo(() => {
  //   const loState = getLastOpened(item.data.nodeid, lastOpenedNote)
  //   return loState
  // }, [lastOpenedNote, item?.data?.nodeid])

  // const isUnread = useMemo(() => {
  //   return lastOpenedState === LastOpenedState.UNREAD
  // }, [lastOpenedState])

  return (
    <Tippy theme="mex" placement="right" singleton={target} content={<TooltipContent item={item} />}>
      <span>
        <ContextMenu.Root
          onOpenChange={(open) => {
            if (open) {
              setContextOpenNodeId(item.data.nodeid)
            } else setContextOpenNodeId(null)
          }}
        >
          <ContextMenu.Trigger asChild>
            <StyledTreeItem
              ref={provided.innerRef}
              selected={isInEditor && item.data && match?.params?.nodeid === item.data.nodeid}
              isDragging={snapshot.isDragging}
              hasMenuOpen={contextOpenNodeId === item.data.nodeid}
              isStub={item?.data?.stub}
              isBeingDroppedAt={isTrue}
              // isUnread={isUnread}
              isHighlighted={isHighlighted}
              onContextMenu={(e) => {
                console.log('ContextySe', e, item)
              }}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <GetIcon item={item} onExpand={onExpand} onCollapse={onCollapse} />
              <ItemContent onMouseDown={(e) => onClick(e, item)}>
                <ItemTitleWithAnalysis item={item} />
              </ItemContent>

              <TreeItemMetaInfo
                item={item}
                // unRead={isUnread}
              />
            </StyledTreeItem>
          </ContextMenu.Trigger>
          <TreeContextMenu
            item={{
              ...item,
              data: {
                ...item.data
                // lastOpenedState
              }
            }}
          />
        </ContextMenu.Root>
      </span>
    </Tippy>
  )
}

const TreeItemMetaInfo = ({ item }: { item: any }) => {
  // TODO: removed unread note code from here because webapp doesn't have the background fetch enabled due to slowdown
  return item.hasChildren && item.children && item.children.length > 0 && <ItemCount>{item.children.length}</ItemCount>
}
