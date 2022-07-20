import {
  default as AtlaskitTree,
  ItemId,
  mutateTree,
  RenderItemParams,
  TreeData,
  TreeDestinationPosition,
  TreeItem,
  TreeSourcePosition
} from '@atlaskit/tree'
import fileList2Line from '@iconify/icons-ri/file-list-2-line'
import { Icon } from '@iconify/react'
import * as ContextMenu from '@radix-ui/react-context-menu'
import Tippy, { useSingleton } from '@tippyjs/react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useContextMenu } from 'react-contexify'
import { useLocation, useMatch } from 'react-router-dom'

import { mog, SEPARATOR, getNameFromPath, IS_DEV } from '@mexit/core'
import {
  StyledTreeItemSwitcher,
  TooltipContentWrapper,
  TooltipCount,
  StyledTreeItem,
  ItemContent,
  ItemTitle,
  ItemCount,
  StyledTreeSwitcher
} from '@mexit/shared'

import { useNavigation } from '../../Hooks/useNavigation'
import { useRouting, ROUTE_PATHS, NavigationType } from '../../Hooks/useRouting'
import { useTreeFromLinks } from '../../Hooks/useTreeFromLinks'
import { useAnalysisStore } from '../../Stores/useAnalysis'
import { useDataStore } from '../../Stores/useDataStore'
import { useEditorStore } from '../../Stores/useEditorStore'
import { useRefactorStore } from '../../Stores/useRefactorStore'
import { useTreeStore } from '../../Stores/useTreeStore'
import { MENU_ID, TreeContextMenu } from './TreeWithContextMenu'

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

export const TooltipContent = ({ item }: { item: TreeItem }) => {
  // console.log('TooltipContent', { item, IS_DEV })
  return (
    <TooltipContentWrapper>
      {item?.data?.title}
      {/* {IS_DEV && ' ' + item?.data?.nodeid} */}
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
      <span>{title}</span>
    </ItemTitle>
  )
}
interface TreeProps {
  initTree: TreeData
}

const defaultSnap = {
  isDragging: false,
  isDropAnimating: false,
  dropAnimation: null,
  mode: null,
  draggingOver: null,
  combineTargetFor: null,
  combineWith: null
}

const Tree = ({ initTree }: TreeProps) => {
  const [tree, setTreeState] = React.useState<TreeData>(initTree)
  const [contextOpenNodeId, setContextOpenNodeId] = useState<string>(null)
  const location = useLocation()

  useEffect(() => {
    setTreeState(initTree)
  }, [initTree])

  // const node = useEditorStore((state) => state.node)
  const expandNode = useTreeStore((state) => state.expandNode)
  const collapseNode = useTreeStore((state) => state.collapseNode)
  const prefillModal = useRefactorStore((state) => state.prefillModal)
  const { goTo } = useRouting()

  const match = useMatch(`${ROUTE_PATHS.node}/:nodeid`)

  const draggedRef = useRef<TreeItem | null>(null)

  const changeTree = (newTree: TreeData) => {
    setTreeState(() => newTree)
  }

  const [source, target] = useSingleton()

  const onOpenItem = (itemId: string, nodeid: string) => {
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
    changeTree(mutateTree(tree, itemId, { isExpanded: true }))
    // appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.MEX, nodeid)
  }

  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: TreeItem) => {
    if (e.button === 0) {
      expandNode(item.data.path)
      onOpenItem(item.id as string, item.data.nodeid)
    }
  }

  const isInEditor = location.pathname.startsWith(ROUTE_PATHS.node)

  const renderItem = ({ item, onExpand, onCollapse, provided, snapshot }: RenderItemParams) => {
    const isTrue = JSON.stringify(snapshot) !== JSON.stringify(defaultSnap)

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
                isBeingDroppedAt={isTrue}
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

                {item.hasChildren && item.children && item.children.length > 0 && (
                  <ItemCount>{item.children.length}</ItemCount>
                )}
              </StyledTreeItem>
            </ContextMenu.Trigger>
            <TreeContextMenu item={item} />
          </ContextMenu.Root>
        </span>
      </Tippy>
    )
  }

  const onExpand = (itemId: ItemId) => {
    const item = tree.items[itemId]
    if (item && item.data && item.data.path) {
      expandNode(item.data.path)
    }

    changeTree(mutateTree(tree, itemId, { isExpanded: true }))
  }

  const onCollapse = (itemId: ItemId) => {
    // const { tree }: State = this.state
    const item = tree.items[itemId]
    if (item && item.data && item.data.path) {
      collapseNode(item.data.path)
    }
    changeTree(mutateTree(tree, itemId, { isExpanded: false }))
  }

  const onDragStart = (itemId: ItemId) => {
    // const { tree }: State = this.state
    const item = tree.items[itemId]
    if (item && item.data && item.data.path) {
      draggedRef.current = item
    }
  }

  const onDragEnd = (source: TreeSourcePosition, destination?: TreeDestinationPosition) => {
    // const { tree } = this.state

    if (!destination || !draggedRef.current) {
      draggedRef.current = null
      return
    }

    if (source === destination) {
      draggedRef.current = null
      return
    }

    if (source.parentId === destination.parentId) {
      return
    }

    const from = draggedRef.current.data.path
    const toItem = tree.items[destination.parentId]
    let to: string | null = null
    if (toItem) {
      if (toItem.id === '1') {
        // Has been dropped on root
        to = getNameFromPath(from)
      } else {
        // Has been dropped inside some item
        to = `${toItem.data.path}${SEPARATOR}${getNameFromPath(from)}`
      }
    }
    mog('onDragEnd', { source, destination, to, from, toItem, tree })

    draggedRef.current = null

    prefillModal(from, to)
    // changeTree(newTree)
  }

  return (
    <>
      <Tippy theme="mex" placement="right" singleton={source} />
      <AtlaskitTree
        offsetPerLevel={16}
        tree={tree}
        renderItem={renderItem}
        onExpand={onExpand}
        onCollapse={onCollapse}
        onDragEnd={onDragEnd}
        onDragStart={onDragStart}
        isDragEnabled
        isNestingEnabled
      />
    </>
  )
}

export const TreeContainer = () => {
  const node = useEditorStore((store) => store.node)
  const ilinks = useDataStore((store) => store.ilinks)

  const { getTreeFromLinks } = useTreeFromLinks()

  const initTree = useMemo(() => getTreeFromLinks(ilinks), [node, ilinks])

  return <Tree initTree={initTree} />
}

export default Tree
