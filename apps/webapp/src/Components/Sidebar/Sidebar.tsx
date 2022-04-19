import gitBranchLine from '@iconify-icons/ri/git-branch-line'
import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import arrowRightSLine from '@iconify-icons/ri/arrow-right-s-line'
import refreshIcon from '@iconify-icons/ri/refresh-line'

import { useFocusTransition } from '../../Hooks/useFocusTransition'
import TreeNode from '../../Types/Tree'
import { TreeWithContextMenu } from './TreeWithContextMenu'
import { SidebarDiv, SidebarContent, SidebarSection, SectionHeading, ILinkRefresh, FlexRow } from '../../Style/Sidebar'
import { useApi } from '../../Hooks/useApi'
import useDataStore from '../../Stores/useDataStore'
import { isEqual } from 'lodash'

export type SideBarProps = { tree: TreeNode[]; starred: TreeNode[] }

const SideBar = ({ tree, starred }: SideBarProps) => {
  const { transitions } = useFocusTransition()
  const [tHide, setThide] = useState(false)
  const setILinks = useDataStore((store) => store.setIlinks)
  const iLinks = useDataStore((store) => store.ilinks)

  const { getILinks } = useApi()

  useEffect(() => {
    RefreshILinks()
  }, [])

  const RefreshILinks = () => {
    getILinks()
      .then((response) => {
        if (!isEqual(iLinks, response)) {
          getILinks(true)
            .then((secondResponse) => {
              setILinks(secondResponse)
            })
            .catch((err) => {
              console.error(err.message)
            })
        } else {
          setILinks(response)
        }
      })
      .catch((err) => {
        console.error(err.message)
      })
  }

  return (
    <SidebarDiv>
      <SidebarContent>
        <SidebarSection className="tree">
          <FlexRow>
            <SectionHeading
              onClick={() => {
                setThide((b) => !b)
              }}
            >
              <Icon height={20} icon={tHide ? arrowRightSLine : gitBranchLine} />
              <h2>Tree</h2>
            </SectionHeading>
            <ILinkRefresh onClick={RefreshILinks}>
              <Icon height={20} icon={refreshIcon} />
            </ILinkRefresh>
          </FlexRow>
          {!tHide && <TreeWithContextMenu tree={tree} />}
        </SidebarSection>
      </SidebarContent>
    </SidebarDiv>
  )
  // return <h1>Hello World</h1>
}

export default SideBar
