import { Icon, IconifyIcon } from '@iconify/react'
import Tippy from '@tippyjs/react'
import { TitleWithShortcut } from '@workduck-io/mex-components'
import React from 'react'

import useLayout from '../../Hooks/useLayout'
import { useEditorStore } from '../../Stores/useEditorStore'
import { useLayoutStore } from '../../Stores/useLayoutStore'
import { SidebarToggle,SpaceHeader, SpaceTitle, SpaceTitleWrapper } from './Sidebar.style'

interface SidebarHeaderLiteProps {
  title: string
  icon: string | IconifyIcon
}

export const SidebarHeaderLite = ({ title, icon }: SidebarHeaderLiteProps) => {
  const sidebar = useLayoutStore((state) => state.sidebar)
  const isUserEdititng = useEditorStore((store) => store.isEditing)
  const toggleSidebar = useLayoutStore((store) => store.toggleSidebar)

  const focusMode = useLayoutStore((state) => state.focusMode)
  const { getFocusProps } = useLayout()
  return (
    <SpaceHeader>
      <SpaceTitleWrapper>
        <SpaceTitle>
          <Icon icon={icon} />
          {title}
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
    </SpaceHeader>
  )
}
