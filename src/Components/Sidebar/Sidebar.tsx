import gitBranchLine from '@iconify-icons/ri/git-branch-line'
import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import arrowRightSLine from '@iconify-icons/ri/arrow-right-s-line'
import bookmark3Line from '@iconify-icons/ri/bookmark-3-line'

import { useFocusTransition } from '../../Hooks/useFocusTransition'
import TreeNode from '../../Types/Tree'
import { TreeWithContextMenu } from './TreeWithContextMenu'
import { SidebarDiv, SidebarContent, SidebarSection, SectionHeading, SidebarDivider } from '../../Style/Sidebar'

export type SideBarProps = { tree: TreeNode[]; starred: TreeNode[] }

const SideBar = ({ tree, starred }: SideBarProps) => {
  const { transitions } = useFocusTransition()
  const [sHide, setShide] = useState(false)
  const [tHide, setThide] = useState(false)

  return transitions(
    (styles, item) =>
      item && (
        <SidebarDiv style={styles}>
          <SidebarContent>
            <SidebarSection className="tree">
              <SectionHeading
                onClick={() => {
                  setThide((b) => !b)
                }}
              >
                <Icon height={20} icon={tHide ? arrowRightSLine : gitBranchLine} />
                <h2>Tree</h2>
              </SectionHeading>
              {!tHide && <TreeWithContextMenu tree={tree} />}
            </SidebarSection>
          </SidebarContent>
        </SidebarDiv>
      )
  )
}

export default SideBar
