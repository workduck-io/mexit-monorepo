import React, { useState } from 'react'

import Tippy from '@tippyjs/react'
import { useSpring } from 'react-spring'

import { TitleWithShortcut } from '@workduck-io/mex-components'

import { TabsContainer, TabHeaderContainer, TabsWrapper, StyledTab, TabPanel, TabBody } from '../Style/Tab.Styles'

export type ExtInfobarMode = 'context' | 'snippets' | 'notes' | 'reminders'
export type InfobarMode = 'default' | 'flow' | 'graph' | 'reminders' | 'suggestions'

export type SingleTabType = ExtInfobarMode | InfobarMode

export type TabType = {
  label: JSX.Element | string
  component: JSX.Element
  type: SingleTabType
  tooltip?: string
  shortcut?: string
}

type TabsProps = {
  tabs: Array<TabType>
  openedTab: SingleTabType
  onChange: (tabType: SingleTabType) => void
  visible?: boolean
}

export const Tabs: React.FC<TabsProps> = ({ tabs, openedTab, onChange, visible }) => {
  const [previousTab, setPreviousTab] = useState(openedTab)

  const animationProps = useSpring({
    from: { opacity: visible ? 0 : 1 },
    to: { opacity: visible ? 1 : 0 }
  })

  const bodyAnimation = useSpring({
    from: { height: visible ? '50%' : '100%' },
    to: { height: visible ? '100%' : '0' }
  })

  if (openedTab !== previousTab) setPreviousTab(openedTab)

  const index = tabs.findIndex((tab) => tab.type === openedTab)

  return (
    <TabsContainer style={animationProps} visible={visible}>
      <TabHeaderContainer>
        <TabsWrapper index={index} total={tabs.length}>
          {tabs.map((tab) => (
            <Tippy
              delay={200}
              key={tab.type}
              theme="mex-bright"
              content={<TitleWithShortcut shortcut={tab.shortcut} title={tab.tooltip} />}
            >
              <StyledTab key={tab.type} onClick={() => onChange(tab.type)} selected={tab.type === openedTab}>
                {tab.label}
              </StyledTab>
            </Tippy>
          ))}
        </TabsWrapper>
      </TabHeaderContainer>
      <TabPanel style={bodyAnimation}>
        <TabBody onClick={() => onChange(openedTab)}>{tabs[index]?.component}</TabBody>
      </TabPanel>
    </TabsContainer>
  )
}
