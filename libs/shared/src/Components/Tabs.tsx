import React, { useState } from 'react'
import { useSpring } from 'react-spring'

import { StyledTab, TabBody, TabHeaderContainer, TabPanel, TabsContainer, TabsWrapper } from '../Style/Tab.Styles'

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
  root?: Element
}

export const Tabs: React.FC<TabsProps> = ({ tabs, openedTab, onChange, visible, root }) => {
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
    // @ts-ignore
    <TabsContainer style={animationProps} visible={visible}>
      <TabHeaderContainer>
        <TabsWrapper index={index} total={tabs.length}>
          {tabs.map((tab) => (
            <StyledTab key={tab.type} onClick={() => onChange(tab.type)} selected={tab.type === openedTab}>
              {tab.label}
            </StyledTab>
          ))}
        </TabsWrapper>
      </TabHeaderContainer>
      <TabPanel style={bodyAnimation}>
        <TabBody onClick={() => onChange(openedTab)}>{tabs[index]?.component}</TabBody>
      </TabPanel>
    </TabsContainer>
  )
}
