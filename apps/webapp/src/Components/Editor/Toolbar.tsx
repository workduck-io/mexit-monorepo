import { Loading , NodeInfo } from '@mexit/shared'
import { useSingleton } from '@tippyjs/react'
import React from 'react'

import useLayout from '../../Hooks/useLayout'
import useToggleElements from '../../Hooks/useToggleElements'
import { useEditorStore } from '../../Stores/useEditorStore'
import { useHelpStore } from '../../Stores/useHelpStore'
import { useLayoutStore } from '../../Stores/useLayoutStore'
import { useShareModalStore } from '../../Stores/useShareModalStore'
import NodeRenameOnlyTitle from './Rename/NodeRename'

const Toolbar = () => {
  const fetchingContent = useEditorStore((state) => state.fetchingContent)
  const { toggleFocusMode, getFocusProps } = useLayout()
  const focusMode = useLayoutStore((store) => store.focusMode)
  const nodeid = useEditorStore((state) => state.node.nodeid)
  const [source, target] = useSingleton()
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const infobar = useLayoutStore((store) => store.infobar)
  const openShareModal = useShareModalStore((store) => store.openModal)
  const shareModalState = useShareModalStore((store) => store.open)
  const shareModalContext = useShareModalStore((store) => store.context)

  const { toggleReminder } = useToggleElements()

  return (
    <NodeInfo>
      <NodeRenameOnlyTitle />
      {fetchingContent && <Loading transparent dots={3} />}
      {/* <InfoTools {...getFocusProps(focusMode)}>
        <ToolbarTooltip singleton={source} />
        <IconButton
          size={24}
          singleton={target}
          transparent={false}
          icon={shareLine}
          title="Share"
          highlight={shareModalState && shareModalContext === 'note'}
          onClick={() => openShareModal('permission', 'note', nodeid)}
        />
        <IconButton
          singleton={target}
          size={24}
          transparent={false}
          icon={focusLine}
          title="Focus Mode"
          shortcut={shortcuts.toggleFocusMode.keystrokes}
          highlight={focusMode.on}
          onClick={toggleFocusMode}
        />
      </InfoTools> */}
    </NodeInfo>
  )
}

export default Toolbar
