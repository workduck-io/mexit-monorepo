import React, { useEffect } from 'react'
import { useMatch } from 'react-router-dom'

import { mog } from '@mexit/core'
import { ItemContent, ItemCount, ItemTitle, MexIcon, StyledTreeItem } from '@mexit/shared'

import { NavigationType,ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { getTreeFromLinks } from '../../Hooks/useTreeFromLinks'
import { useDataStore } from '../../Stores/useDataStore'
import { Centered } from './Bookmarks'
import { SidebarWrapper } from './Sidebar.style'
import { GetIcon, TooltipContent } from './Tree'
import Tree, { ItemId, mutateTree, RenderItemParams, TreeData,TreeItem } from '@atlaskit/tree'
import archiveLine from '@iconify/icons-ri/archive-line'
import fileList2Line from '@iconify/icons-ri/file-list-2-line'
import { Icon } from '@iconify/react'
import * as ContextMenu from '@radix-ui/react-context-menu'
import Tippy, { useSingleton } from '@tippyjs/react'
import styled, { useTheme } from 'styled-components'

export const Margin = styled.div<{ margin: string }>`
  margin: ${(props) => props.margin};
`

const ArchiveTree: React.FC<{ tree: any }> = ({ tree }) => {
  const [archiveTree, setArchiveTree] = React.useState(tree)

  useEffect(() => {
    setArchiveTree(tree)
  }, [tree])

  const { goTo } = useRouting()
  const [source, target] = useSingleton()
  const match = useMatch(`${ROUTE_PATHS.archive}/:nodeid`)

  const onExpand = (itemId: ItemId) => {
    changeTree(mutateTree(archiveTree, itemId, { isExpanded: true }))
  }

  const changeTree = (newTree: TreeData) => {
    setArchiveTree(() => newTree)
  }

  const onCollapse = (itemId: ItemId) => {
    changeTree(mutateTree(archiveTree, itemId, { isExpanded: false }))
  }

  const onOpenItem = (itemId: string, nodeid: string) => {
    changeTree(mutateTree(archiveTree, itemId, { isExpanded: true }))
    goTo(ROUTE_PATHS.archive, NavigationType.push, nodeid)
  }

  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: TreeItem) => {
    if (e.button === 0) {
      onOpenItem(item.id as string, item.data.nodeid)
    }
  }

  const renderItem = ({ item, onExpand, onCollapse, provided }: RenderItemParams) => {
    const title = item.data ? item.data.title : 'No Title'

    return (
      <Tippy theme="mex" placement="right" singleton={target} content={<TooltipContent item={item} />}>
        <span>
          <ContextMenu.Root>
            <ContextMenu.Trigger asChild>
              <StyledTreeItem
                ref={provided.innerRef}
                selected={item.data && match?.params?.nodeid === item.data.nodeid}
                onContextMenu={(e) => {
                  mog('ContextySe', { e, item })
                }}
                {...provided.draggableProps}
              >
                <GetIcon item={item} onExpand={onExpand} onCollapse={onCollapse} />

                <ItemContent onMouseDown={(e) => onClick(e, item)}>
                  <ItemTitle>
                    <Icon icon={item.data.mex_icon ?? fileList2Line} />
                    <span>{title}</span>
                  </ItemTitle>
                </ItemContent>
                {item.hasChildren && item.children && item.children.length > 0 && (
                  <ItemCount>{item.children.length}</ItemCount>
                )}
              </StyledTreeItem>
            </ContextMenu.Trigger>
            {/* <ArchiveContextMenu item={item} /> */}
          </ContextMenu.Root>
        </span>
      </Tippy>
    )
  }

  return (
    <Margin margin="1rem 0 0">
      <Tippy theme="mex" placement="right" singleton={source} />
      <Tree
        offsetPerLevel={16}
        tree={archiveTree}
        renderItem={renderItem}
        onExpand={onExpand}
        onCollapse={onCollapse}
        isNestingEnabled
      />
    </Margin>
  )
}

const NoArchiveNotes = () => {
  const theme = useTheme()

  return (
    <Centered>
      <MexIcon color={theme.colors.primary} height={24} width={24} icon={archiveLine} margin="0 0 1rem 0" />
      <span>Your archive is empty!</span>
    </Centered>
  )
}

const ArchiveSidebar = () => {
  const archiveNotes = useDataStore((store) => store.archive)

  if (!archiveNotes || archiveNotes.length === 0) return <NoArchiveNotes />

  const tree = getTreeFromLinks(archiveNotes)

  return (
    <SidebarWrapper>
      <ArchiveTree tree={tree} />
    </SidebarWrapper>
  )
}

export default ArchiveSidebar
