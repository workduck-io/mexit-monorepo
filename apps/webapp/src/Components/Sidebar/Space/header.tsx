import React, { useEffect, useState } from 'react'

import { Icon } from '@iconify/react'
import Tippy from '@tippyjs/react'
import toast from 'react-hot-toast'

import { TitleWithShortcut } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'

import { MIcon, RESERVED_NAMESPACES } from '@mexit/core'
import { IconButton, Input } from '@mexit/shared'

import useLayout from '../../../Hooks/useLayout'
import { useNamespaces } from '../../../Hooks/useNamespaces'
import { useDataStore } from '../../../Stores/useDataStore'
import { useEditorStore } from '../../../Stores/useEditorStore'
import { useLayoutStore } from '../../../Stores/useLayoutStore'
import { Tooltip } from '../../FloatingElements/Tooltip'
import IconPicker from '../../IconPicker/IconPicker'
import {
  SidebarToggle,
  SpaceHeader,
  SpaceSeparator,
  SpaceTitle,
  SpaceTitleFakeInput,
  SpaceTitleWrapper
} from '../Sidebar.style'
import { SidebarSpace } from '../Sidebar.types'
import { TagsLabel } from '../TagLabel'
import { useShareModalStore } from '../../../Stores/useShareModalStore'

const Header = ({ space, readOnly }: { space: SidebarSpace; readOnly?: boolean }) => {
  const sidebar = useLayoutStore((state) => state.sidebar)
  // const node = useEditorStore((store) => store.node)
  const toggleSidebar = useLayoutStore((store) => store.toggleSidebar)
  const focusMode = useLayoutStore((state) => state.focusMode)
  const isUserEdititng = useEditorStore((store) => store.isEditing)
  const { getFocusProps } = useLayout()
  const inpRef = React.useRef<HTMLInputElement>(null)
  const titleRef = React.useRef<HTMLDivElement>(null)
  const { changeNamespaceName, changeNamespaceIcon } = useNamespaces()
  const [showInput, setShowInput] = useState(false)
  const [title, setTitle] = useState(space?.label)
  const openShareModal = useShareModalStore((store) => store.openModal)

  const onChangeName = (name: string) => {
    // mog('onChangeName', { name })
    if (!name) return
    const namespaceNames = useDataStore
      .getState()
      .namespaces.filter((ns) => ns.id !== space?.id)
      .map((ns) => ns.name)
    const allowRename =
      !namespaceNames.includes(name) && name !== RESERVED_NAMESPACES.default && name !== RESERVED_NAMESPACES.shared

    if (allowRename) {
      changeNamespaceName(space?.id, name)
      setTitle(name)
    } else {
      toast.error('Space already exists!')
      if (inpRef.current) {
        inpRef.current.value = space?.label
        setTitle(space?.label)
      }
    }

    setShowInput(false)
  }

  const onChangeIcon = (icon: MIcon) => {
    changeNamespaceIcon(space?.id, space?.label, icon)
  }

  const onShareSpace = () => {
    openShareModal('permission', 'space', space?.id)
  }

  useEffect(() => {
    if (inpRef.current) {
      if (showInput) {
        inpRef.current.focus()
      }
      const unsubscribe = tinykeys(inpRef.current, {
        Enter: (event: KeyboardEvent) => {
          event.preventDefault()
          const name = inpRef.current?.value
          onChangeName(name)
        }
      })
      return () => {
        unsubscribe()
      }
    }
  }, [inpRef, showInput])

  const isNamespaceReserved =
    space?.label === RESERVED_NAMESPACES.default || space?.label === RESERVED_NAMESPACES.shared

  const isNamespaceReadonly = space.data.access === 'READ'
  const isNamespaceInputDisabled = isNamespaceReserved || isNamespaceReadonly || readOnly
  const isNamespaceIconDisabled = isNamespaceReserved || isNamespaceReadonly || readOnly
  const showTags = space?.popularTags && space?.popularTags.length > 0
  const showSeparator = showTags

  return (
    <>
      <SpaceHeader>
        <SpaceTitleWrapper>
          <SpaceTitle>
            <IconPicker size={20} allowPicker={!isNamespaceIconDisabled} onChange={onChangeIcon} value={space?.icon} />
            {showInput && !isNamespaceInputDisabled ? (
              <Input defaultValue={space?.label} onBlur={(e) => onChangeName(e.target.value)} ref={inpRef} />
            ) : (
              <Tooltip content={readOnly ? 'Space Name' : 'Click to rename Space'}>
                <SpaceTitleFakeInput
                  ref={titleRef}
                  onClick={() => {
                    setShowInput(true)
                  }}
                >
                  {title}
                </SpaceTitleFakeInput>
              </Tooltip>
            )}
          </SpaceTitle>
          {!isNamespaceReserved && <IconButton title="Share Space" icon="ri:share-line" onClick={onShareSpace} />}
          <Tippy
            theme="mex-bright"
            placement="right"
            content={<TitleWithShortcut title={sidebar?.expanded ? 'Collapse Sidebar' : 'Expand Sidebar'} />}
          >
            <SidebarToggle isVisible={!isUserEdititng} onClick={toggleSidebar} {...getFocusProps(focusMode)}>
              <Icon
                icon={sidebar.expanded ? 'heroicons-solid:chevron-double-left' : 'heroicons-solid:chevron-double-right'}
              />
            </SidebarToggle>
          </Tippy>
        </SpaceTitleWrapper>
        {/*space.pinnedItems && <space.pinnedItems />*/}
        {showTags && <TagsLabel tags={space?.popularTags} />}
      </SpaceHeader>
      {showSeparator && <SpaceSeparator />}
    </>
  )
}

export default Header
