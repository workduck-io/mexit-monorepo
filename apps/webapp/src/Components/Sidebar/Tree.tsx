import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useMatch } from 'react-router-dom'

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
import { Icon } from '@iconify/react'
import Tippy, { useSingleton } from '@tippyjs/react'

import { tinykeys } from '@workduck-io/tinykeys'

import {
  getNameFromPath,
  mog,
  RecentType,
  SEPARATOR,
  useDataStore,
  useEditorStore,
  useRecentsStore,
  userPreferenceStore as useUserPreferenceStore,
  useTreeStore} from '@mexit/core'
import {
  isOnEditableElement,
  StyledTreeItemSwitcher,
  StyledTreeSwitcher,
  TooltipContentWrapper,
  TooltipCount
} from '@mexit/shared'

import { getNextWrappingIndex } from '../../Editor/Utils/getNextWrappingIndex'
import { useNavigation } from '../../Hooks/useNavigation'
import { useRefactor } from '../../Hooks/useRefactor'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { getTreeFromLinks } from '../../Hooks/useTreeFromLinks'
import { flattenNestedTreeFromIds } from '../../Utils/tree'

import { RenderTreeItem } from './TreeItem'

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

interface TreeProps {
  initTree: TreeData
  selectedItemId?: string
  readOnly?: boolean
}

const Tree = ({ initTree, selectedItemId, readOnly }: TreeProps) => {
  const [tree, setTreeState] = React.useState<TreeData>(initTree)
  const [contextOpenNodeId, setContextOpenNodeId] = useState<string>(null)
  const location = useLocation()
  const addRecent = useRecentsStore((state) => state.addRecent)
  const setpreferenceModifiedAtAndLastOpened = useUserPreferenceStore(
    (store) => store.setpreferenceModifiedAtAndLastOpened
  )

  useEffect(() => {
    setTreeState(initTree)
  }, [initTree])

  // const node = useEditorStore((state) => state.node)
  const expandNode = useTreeStore((state) => state.expandNode)
  const collapseNode = useTreeStore((state) => state.collapseNode)
  const { push } = useNavigation()
  const { goTo } = useRouting()

  const match = useMatch(`${ROUTE_PATHS.node}/:nodeid`)
  const publicNamespaceMatch = useMatch(`${ROUTE_PATHS.namespaceShare}/:namespaceid/node/:nodeid`)

  const flattenTree = useMemo(() => {
    const newTree = flattenNestedTreeFromIds(Object.values(initTree.items['1']), initTree.items)
    return newTree.slice(1)
  }, [initTree])

  const recursivelyExpand = (tree, item, treeRecord) => {
    if (item.data?.parentId) {
      const parentItem = treeRecord[item.data?.parentId]

      if (!parentItem?.isExpanded) {
        const newTree = mutateTree(tree, parentItem.id, { isExpanded: true })
        expandNode(parentItem.data.path)
        return recursivelyExpand(newTree, parentItem, treeRecord)
      }
    }

    return tree
  }

  const onTreeNavigatePress = useCallback(
    (reverse = false) =>
      (e) => {
        if (!isOnEditableElement(e)) {
          e.preventDefault()
          const at = flattenTree.findIndex(
            (i) => match?.params?.nodeid === i.data.nodeid || publicNamespaceMatch?.params?.nodeid === i.data.nodeid
          )

          let index = 0
          if (at >= 0) index = getNextWrappingIndex(reverse ? -1 : 1, at, flattenTree.length, () => undefined, false)

          const newNote = flattenTree[index]
          expandNode(newNote.data.path)

          if (newNote.data?.parentId) {
            goToNodeId(newNote.data?.nodeid)
            changeTree(recursivelyExpand(tree, newNote, tree.items))
          } else {
            onOpenItem(newNote.id, newNote.data?.nodeid)
          }
        }
      },
    [match, publicNamespaceMatch, flattenTree, tree]
  )

  useEffect(() => {
    const unsuscribe = tinykeys(window, {
      'Alt+ArrowUp': onTreeNavigatePress(true),
      'Alt+ArrowDown': onTreeNavigatePress()
    })

    return () => unsuscribe()
  }, [onTreeNavigatePress])

  const { execRefactorAsync } = useRefactor()
  const draggedRef = useRef<TreeItem | null>(null)

  const changeTree = (newTree: TreeData) => {
    setTreeState(() => newTree)
  }

  const [source, target] = useSingleton()

  const goToNodeId = (nodeId: string) => {
    if (publicNamespaceMatch) {
      goTo(`${ROUTE_PATHS.namespaceShare}/${publicNamespaceMatch.params.namespaceid}/node`, NavigationType.push, nodeId)
    } else {
      mog('goToNodeId', { nodeId })
      push(nodeId)
      goTo(ROUTE_PATHS.node, NavigationType.push, nodeId)
      addRecent(RecentType.notes, nodeId)
      setpreferenceModifiedAtAndLastOpened(Date.now(), useRecentsStore.getState().lastOpened)
    }
  }

  const onOpenItem = (itemId: string, nodeid: string) => {
    goToNodeId(nodeid)
    changeTree(mutateTree(tree, itemId, { isExpanded: true }))
  }

  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: TreeItem) => {
    if (e.button === 0) {
      goToNodeId(item.data.nodeid)
    }
  }

  const isInEditor =
    location.pathname.startsWith(ROUTE_PATHS.node) || location.pathname.startsWith(ROUTE_PATHS.namespaceShare)

  const renderItem = (renderProps: RenderItemParams) => {
    return (
      <RenderTreeItem
        {...renderProps}
        onClick={onClick}
        readOnly={readOnly}
        match={match || publicNamespaceMatch}
        isInEditor={isInEditor}
        isHighlighted={renderProps.item?.data?.nodeid === selectedItemId}
        target={target}
        contextOpenNodeId={contextOpenNodeId}
        setContextOpenNodeId={setContextOpenNodeId}
      />
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
    const fromItem = tree.items[source.parentId]
    const toItem = tree.items[destination.parentId]
    const nsID = fromItem.data?.namespace ?? toItem.data?.namespace
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

    draggedRef.current = null

    execRefactorAsync({ path: from, namespaceID: nsID }, { path: to, namespaceID: nsID })
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
        isDragEnabled={!readOnly}
        isNestingEnabled
      />
    </>
  )
}

export const TreeContainer = () => {
  const node = useEditorStore((store) => store.node)
  const ilinks = useDataStore((store) => store.ilinks)

  const initTree = useMemo(() => getTreeFromLinks(ilinks), [node, ilinks])

  return <Tree initTree={initTree} />
}

export default Tree
