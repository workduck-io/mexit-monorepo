import React from 'react'
import focusLine from '@iconify/icons-ri/focus-line'
import { useSingleton } from '@tippyjs/react'
import shareLine from '@iconify/icons-ri/share-line'

import { Loading, ToolbarTooltip, IconButton } from '@mexit/shared'

import useLayout from '../../Hooks/useLayout'
import { useLayoutStore } from '../../Stores/useLayoutStore'
import { useHelpStore } from '../../Stores/useHelpStore'
import { InfoTools, NodeInfo } from '@mexit/shared'
import BookmarkButton from '../Buttons/BookmarkButton'
import { useEditorStore } from '../../Stores/useEditorStore'
import NodeRenameOnlyTitle from './Rename/NodeRename'

const Toolbar = () => {
  const fetchingContent = useEditorStore((state) => state.fetchingContent)
  const { toggleFocusMode, getFocusProps } = useLayout()
  const focusMode = useLayoutStore((store) => store.focusMode)
  const nodeid = useEditorStore((state) => state.node.nodeid)
  const [source, target] = useSingleton()
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const showShareOptions = useLayoutStore((store) => store.showShareOptions)
  const toggleShareOptions = useLayoutStore((store) => store.toggleShareOptions)

  return (
    <NodeInfo {...getFocusProps(focusMode)}>
      <NodeRenameOnlyTitle />
      {fetchingContent && <Loading dots={3} />}
      <InfoTools>
        <ToolbarTooltip singleton={source} />
        <IconButton
          singleton={target}
          size={24}
          icon={shareLine}
          title="Share"
          highlight={showShareOptions}
          onClick={toggleShareOptions}
        />
        {/* <ToolbarTooltip singleton={target} content="Bookmark">
          <span tabIndex={0}>
            <BookmarkButton nodeid={nodeid} />
          </span>
        </ToolbarTooltip> */}
        <IconButton
          singleton={target}
          size={24}
          icon={focusLine}
          title="Focus Mode"
          shortcut={shortcuts.toggleFocusMode.keystrokes}
          highlight={focusMode.on}
          onClick={toggleFocusMode}
        />
      </InfoTools>
    </NodeInfo>
  )
}

export default Toolbar
