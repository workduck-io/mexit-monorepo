import React, { useEffect, useRef } from 'react'
import { PathMatch } from 'react-router-dom'

import { ItemId, RenderItemParams, TreeItem } from '@atlaskit/tree'
// import { complexTree } from '../mockdata/complexTree'
import { Icon } from '@iconify/react'
import * as ContextMenu from '@radix-ui/react-context-menu'
import Tippy from '@tippyjs/react'

import { DRAFT_NODE, IS_DEV } from '@mexit/core'
import {
  IconDisplay,
  ItemContent,
  ItemCount,
  ItemTitle,
  ItemTitleText,
  StyledTreeItem,
  StyledTreeItemSwitcher,
  StyledTreeSwitcher,
  TooltipContentWrapper,
  TooltipCount
} from '@mexit/shared'

import { useMetadataStore } from '../../Stores/useMetadataStore'

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
  // const anal = useAnalysisStore((state) => state.analysis)
  const icon = useMetadataStore((s) => s.metadata.notes[item.data?.nodeid]?.icon)
  const title = item.data?.title ?? DRAFT_NODE

  return (
    <ItemTitle>
      <IconDisplay icon={icon} />
      {/* <Icon icon={item.data.mex_icon ?? fileList2Line} /> */}
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
  readOnly?: boolean
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
  readOnly,
  isHighlighted,
  match,
  onClick
}: TreeItemProps) => {
  const isTrue = !readOnly && JSON.stringify(snapshot) !== JSON.stringify(defaultSnap)
  const ref = useRef<HTMLElement>()
  // const highlightedAt = useTreeStore((s) => s.highlightedAt)

  useEffect(() => {
    if (ref.current) {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [ref?.current])

  // const lastOpenedNote = useUserPreferenceStore((state) => state.lastOpenedNotes[item?.data?.nodeid])
  // const { getLastOpened } = useLastOpened()

  // const lastOpenedState = useMemo(() => {
  //   const loState = getLastOpened(item.data.nodeid, lastOpenedNote)
  //   return loState
  // }, [lastOpenedNote, item?.data?.nodeid])

  // const isUnread = useMemo(() => {
  //   return lastOpenedState === LastOpenedState.UNREAD
  // }, [lastOpenedState])

  // console.log('Highlighted at', { highlightedAt, item })

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
