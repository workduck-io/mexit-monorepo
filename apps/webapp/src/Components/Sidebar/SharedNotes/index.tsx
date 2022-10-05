import React from 'react'

import { ContextMenuContent } from '@radix-ui/react-context-menu'
import styled, { useTheme } from 'styled-components'

import { SharedNode } from '@mexit/core'
import { Centered, SharedNodeIcon, SharedNodeIconify } from '@mexit/shared'

import { useNavigation } from '../../../Hooks/useNavigation'
import { useRouting, ROUTE_PATHS, NavigationType } from '../../../Hooks/useRouting'
import { useDataStore } from '../../../Stores/useDataStore'
import { useEditorStore } from '../../../Stores/useEditorStore'
import SidebarList, { SidebarListItem } from '../SidebarList'

export const ItemContent = styled.div`
  cursor: pointer;
  padding: 8px 0px;
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.tiny};
`

interface SharedNoteContextMenuProps {
  item: SidebarListItem<SharedNode>
}

const SharedNoteContextMenu = ({ item }: SharedNoteContextMenuProps) => {
  return (
    <>
      <ContextMenuContent>
        {/* <MuteMenuItem lastOpenedState={item?.lastOpenedState} nodeid={item.id} /> */}
      </ContextMenuContent>
    </>
  )
}

const SharedNotes = () => {
  const sharedNodes = useDataStore((store) => store.sharedNodes)
  const { push } = useNavigation()

  // const [sharedNodes, setSharedNodes] = useState<SharedNode[]>([])
  const { goTo } = useRouting()
  const theme = useTheme()
  const node = useEditorStore((s) => s.node)

  const onOpenNode = (nodeid: string) => {
    push(nodeid, { fetch: true })
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
  }

  return sharedNodes.length > 0 ? (
    <SidebarList
      items={sharedNodes.map((node) => ({
        id: node.nodeid,
        label: node.path,
        icon: SharedNodeIconify,
        lastOpenedId: node.nodeid,
        data: node
      }))}
      onClick={onOpenNode}
      showSearch
      ItemContextMenu={SharedNoteContextMenu}
      selectedItemId={node.nodeid}
      searchPlaceholder="Filter Shared Notes"
      emptyMessage="No shared notes found"
    />
  ) : (
    <Centered>
      <SharedNodeIcon height={64} width={64} fill={theme.colors.text.default} margin="0 0 1rem 0" />
      <span>No one has shared Notes with you yet!</span>
    </Centered>
  )
}

export default SharedNotes
