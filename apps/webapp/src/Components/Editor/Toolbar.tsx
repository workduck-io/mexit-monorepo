import React from 'react'
import { useSingleton } from '@tippyjs/react'
import timerFlashLine from '@iconify/icons-ri/timer-flash-line'
import shareLine from '@iconify/icons-ri/share-line'
import focusLine from '@iconify/icons-ri/focus-line'

import { Loading, ToolbarTooltip, IconButton } from '@mexit/shared'

import useLayout from '../../Hooks/useLayout'
import { useLayoutStore } from '../../Stores/useLayoutStore'
import { useHelpStore } from '../../Stores/useHelpStore'
import { InfoTools, NodeInfo } from '@mexit/shared'
import BookmarkButton from '../Buttons/BookmarkButton'
import { useEditorStore } from '../../Stores/useEditorStore'
import NodeRenameOnlyTitle from './Rename/NodeRename'
import useToggleElements from '../../Hooks/useToggleElements'
import { useShareModalStore } from '../../Stores/useShareModalStore'

const Toolbar = () => {
  const fetchingContent = useEditorStore((state) => state.fetchingContent)
  const { toggleFocusMode, getFocusProps } = useLayout()
  const focusMode = useLayoutStore((store) => store.focusMode)
  const nodeid = useEditorStore((state) => state.node.nodeid)
  const [source, target] = useSingleton()
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const showShareOptions = useLayoutStore((store) => store.showShareOptions)
  const infobar = useLayoutStore((store) => store.infobar)
  const toggleShareOptions = useLayoutStore((store) => store.toggleShareOptions)
  const openShareModal = useShareModalStore((store) => store.openModal)
  const shareModalState = useShareModalStore((store) => store.open)

  const { toggleReminder } = useToggleElements()

  return (
    <NodeInfo {...getFocusProps(focusMode)}>
      <NodeRenameOnlyTitle />
      {fetchingContent && <Loading dots={3} />}
      <InfoTools>
        <ToolbarTooltip singleton={source} />
        <IconButton
          size={24}
          singleton={target}
          icon={shareLine}
          title="Share"
          highlight={shareModalState}
          onClick={() => openShareModal('permission')}
        />
        <ToolbarTooltip singleton={target} content="Bookmark">
          <span tabIndex={0}>
            <BookmarkButton nodeid={nodeid} />
          </span>
        </ToolbarTooltip>

        <IconButton
          size={24}
          singleton={target}
          icon={timerFlashLine}
          shortcut={shortcuts?.showReminder?.keystrokes}
          title="Reminders"
          highlight={infobar.mode === 'reminders'}
          onClick={toggleReminder}
        />
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
