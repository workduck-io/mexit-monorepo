import React, { CSSProperties } from 'react'

import { Icon } from '@iconify/react'
import { AnimatedProps } from '@react-spring/web'
import Tippy from '@tippyjs/react'

import { TitleWithShortcut } from '@workduck-io/mex-components'

import useLayout from '../../Hooks/useLayout'
import { useEditorStore } from '../../Stores/useEditorStore'
import { useLayoutStore } from '../../Stores/useLayoutStore'
import { SingleSpace, SpaceHeader, SpaceTitleWrapper, SpaceTitle, SidebarToggle, SpaceSeparator } from './Sidebar.style'
import { MexTree } from './Sidebar.tree'
import { SidebarSpace } from './Sidebar.types'
import { TagsLabel } from './TagLabel'

interface SidebarSpaceProps {
  space: SidebarSpace
  style: CSSProperties
}

export const SidebarSpaceComponent = ({ space, style }: AnimatedProps<SidebarSpaceProps>) => {
  const sidebar = useLayoutStore((state) => state.sidebar)
  // const node = useEditorStore((store) => store.node)
  const toggleSidebar = useLayoutStore((store) => store.toggleSidebar)
  const focusMode = useLayoutStore((state) => state.focusMode)
  const isUserEdititng = useEditorStore((store) => store.isEditing)
  const { getFocusProps } = useLayout()

  // return <div>Space</div>
  return (
    <SingleSpace style={style}>
      <SpaceHeader>
        <SpaceTitleWrapper>
          <SpaceTitle>
            <Icon icon={space.icon} />
            {space.label}
          </SpaceTitle>
          <Tippy
            theme="mex-bright"
            placement="right"
            content={<TitleWithShortcut title={sidebar.expanded ? 'Collapse Sidebar' : 'Expand Sidebar'} />}
          >
            <SidebarToggle isVisible={!isUserEdititng} onClick={toggleSidebar} {...getFocusProps(focusMode)}>
              <Icon
                icon={sidebar.expanded ? 'heroicons-solid:chevron-double-left' : 'heroicons-solid:chevron-double-right'}
              />
            </SidebarToggle>
          </Tippy>
        </SpaceTitleWrapper>
        {/*space.pinnedItems && <space.pinnedItems />*/}
        {space.popularTags && space.popularTags.length > 0 && <TagsLabel tags={space.popularTags} />}
      </SpaceHeader>

      <SpaceSeparator />
      {
        {
          hierarchy: space.list.type === 'hierarchy' && <MexTree items={space.list.items} filterText="Filter Notes" />,
          flat: space.list.type === 'flat' && <space.list.renderItems />
        }[space.list.type]
      }
    </SingleSpace>
  )
}
