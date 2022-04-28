import bookmark3Line from '@iconify/icons-ri/bookmark-3-line'
import { BookmarksHelp } from '../../Data/defaultText'
import useLayout from '../../Hooks/useLayout'
import Collapse from '../../Layout/Collapse'
import { useLayoutStore } from '../../Stores/useLayoutStore'
import { SidebarDiv, SidebarContent, SidebarDivider } from '../../Style/Sidebar'
import Bookmarks from './Bookmarks'
import { TreeNode } from '@mexit/shared'

export type SideBarProps = { tree: TreeNode[]; starred: TreeNode[] }

const SideBar = ({ tree }: SideBarProps) => {
  // const { transitions } = useFocusTransition()
  const focusMode = useLayoutStore((s) => s.focusMode)
  const { getFocusProps } = useLayout()

  return (
    <SidebarDiv {...getFocusProps(focusMode)}>
      <SidebarContent>
        <Collapse
          title="Bookmarks"
          oid="Bookmarks"
          icon={bookmark3Line}
          maximumHeight="30vh"
          infoProps={{
            text: BookmarksHelp
          }}
        >
          <Bookmarks />
        </Collapse>

        <SidebarDivider />
      </SidebarContent>
    </SidebarDiv>
  )
}

export default SideBar
