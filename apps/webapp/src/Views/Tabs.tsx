import React, { useState } from 'react'
import { useSpring } from 'react-spring'
import Tippy from '@tippyjs/react'

import { TooltipTitleWithShortcut } from '../Components/Shortcuts'
import { TabsContainer, TabHeaderContainer, StyledTab, TabPanel, TabBody } from './Tab.Styles'

type TabType = {
  label: JSX.Element | string
  component: JSX.Element
  key: string | number
  tooltip?: string
}

type TabsProps = {
  tabs: Array<TabType>
  openedTab: number
  onChange: (index: number) => void
  visible?: boolean
}

const Tabs: React.FC<TabsProps> = ({ tabs, openedTab, onChange, visible }) => {
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

  return (
    // eslint-disable-next-line
    // @ts-ignore
    <TabsContainer style={animationProps} visible={visible.toString()}>
      <TabHeaderContainer>
        {tabs.map((tab, tabIndex) => (
          <Tippy delay={200} key={tabIndex} theme="mex" content={<TooltipTitleWithShortcut title={tab.tooltip} />}>
            <StyledTab key={tabIndex} onClick={() => onChange(tabIndex)} selected={tabIndex === openedTab}>
              {tab.label}
            </StyledTab>
          </Tippy>
        ))}
      </TabHeaderContainer>
      <TabPanel style={bodyAnimation}>
        <TabBody onClick={() => onChange(openedTab)}>{tabs[openedTab]?.component}</TabBody>
      </TabPanel>
    </TabsContainer>
  )
}

export default Tabs
