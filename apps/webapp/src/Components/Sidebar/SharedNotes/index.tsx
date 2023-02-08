import React from 'react'

import styled, { useTheme } from 'styled-components'

import { DefaultMIcons, SharedNode } from '@mexit/core'
import { Centered, SharedNodeIcon } from '@mexit/shared'

import { useNavigation } from '../../../Hooks/useNavigation'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../Hooks/useRouting'
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
  // * Mute a Shared Note
  return <></>
  // return (
  //   <ContextMenuContent>
  //     <MuteMenuItem lastOpenedState={item?.lastOpenedState} nodeid={item.id} />
  //   </ContextMenuContent>
  // )
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
      noMargin
      items={sharedNodes.map((node) => ({
        id: node.nodeid,
        label: node.path,
        icon: DefaultMIcons.SHARED_NOTE,
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
    <Centered style={{ flexDirection: 'column' }}>
      <SharedNodeIcon height={64} width={64} fill={theme.tokens.text.fade} margin="0 0 1rem 0" />
      <br />
      <p>No shared notes</p>
    </Centered>
  )
}

export default SharedNotes
