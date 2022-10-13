import React, { useMemo } from 'react'

import quillPenLine from '@iconify/icons-ri/quill-pen-line'
import timerFlashLine from '@iconify/icons-ri/timer-flash-line'
import { Icon } from '@iconify/react'
import Tippy from '@tippyjs/react'

import { TitleWithShortcut } from '@workduck-io/mex-components'

import {
  ExtInfobarMode,
  InfoBarWrapper,
  MexIcon,
  ReminderInfobar,
  SidebarToggleWrapper,
  Tabs,
  TabType
} from '@mexit/shared'

import { useSidebarTransition } from '../../Hooks/useSidebarTransition'
import { useLayoutStore } from '../../Stores/useLayoutStore'
import { ContextInfoBar } from './ContextInfoBar'
import { SnippetsInfoBar } from './SnippetsInfoBar'
import { ExtSideNav } from './styled'

const ExtInfoBarItems = () => {
  const infobar = useLayoutStore((s) => s.infobar)
  const setInfobarMode = useLayoutStore((s) => s.setInfobarMode)

  // Ensure the tabs have InfobarType in type
  const tabs: Array<TabType> = useMemo(
    () => [
      {
        label: <MexIcon $noHover icon="mdi:web-plus" width={24} height={24} />,
        type: 'context',
        component: <ContextInfoBar />,
        tooltip: 'Context'
      },
      {
        label: <MexIcon $noHover icon={quillPenLine} width={24} height={24} />,
        type: 'snippets',
        component: <SnippetsInfoBar />,
        tooltip: 'Snippets'
      }
      // TODO: add this back when we have url based reminders
      // The reminderUI components already moved to @mexit/shared
      // {
      //   label: <MexIcon $noHover icon={timerFlashLine} width={24} height={24} />,
      //   type: 'reminders',
      //   component: <ReminderInfobar />,
      //   tooltip: 'Reminders'
      // }
    ],
    []
  )

  return (
    <Tabs
      visible={true}
      openedTab={infobar.mode}
      onChange={(tab) => {
        setInfobarMode(tab as ExtInfobarMode)
      }}
      tabs={tabs}
    />
  )
}

export const ExtInfoBar = () => {
  const { rhSidebar, toggleRHSidebar } = useLayoutStore()
  const { rhSidebarSpringProps, overlaySidebar, endColumnWidth } = useSidebarTransition()

  const infobar = useLayoutStore((s) => s.infobar)

  return (
    <div id="ext-side-nav">
      <ExtSideNav
        style={rhSidebarSpringProps}
        $show={rhSidebar.show}
        $expanded={rhSidebar.expanded}
        $overlaySidebar={true}
        $side="right"
        $publicNamespace={false}
      >
        <InfoBarWrapper
          mode={infobar.mode}
        // {...getFocusProps(focusMode)}
        >
          <ExtInfoBarItems />
        </InfoBarWrapper>
      </ExtSideNav>
      <Tippy
        theme="mex-bright"
        placement="left"
        content={<TitleWithShortcut title={rhSidebar.expanded ? 'Collapse Cooler Sidebar' : 'Expand Cooler Sidebar'} />}
      >
        <SidebarToggleWrapper
          side="right"
          $isVisible={true}
          onClick={toggleRHSidebar}
          expanded={rhSidebar.expanded}
          show={rhSidebar.show}
          endColumnWidth={endColumnWidth}
        // {...getFocusProps(focusMode)}
        >
          <Icon
            icon={rhSidebar.expanded ? 'heroicons-solid:chevron-double-right' : 'heroicons-solid:chevron-double-left'}
          />
        </SidebarToggleWrapper>
      </Tippy>
    </div>
  )
}
