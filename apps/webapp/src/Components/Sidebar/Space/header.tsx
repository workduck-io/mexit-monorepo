import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { Icon } from '@iconify/react'
import Tippy from '@tippyjs/react'

import { IconButton, TitleWithShortcut } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'

import { MIcon, RESERVED_NAMESPACES } from '@mexit/core'
import { Input, TagsLabel, Tooltip } from '@mexit/shared'

import useLayout from '../../../Hooks/useLayout'
import { useNamespaces } from '../../../Hooks/useNamespaces'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../Hooks/useRouting'
import { useDataStore } from '../../../Stores/useDataStore'
import { useEditorStore } from '../../../Stores/useEditorStore'
import { useLayoutStore } from '../../../Stores/useLayoutStore'
import { useShareModalStore } from '../../../Stores/useShareModalStore'
import IconPicker from '../../IconPicker/IconPicker'
import {
  SidebarToggle,
  SpaceHeader,
  SpaceSeparator,
  SpaceTitle,
  SpaceTitleFakeInput,
  SpaceTitleWrapper,
  VisibleFade
} from '../Sidebar.style'
import { SidebarSpace } from '../Sidebar.types'

const Header = ({
  space,
  readOnly,
  hideShareSpace
}: {
  space: SidebarSpace
  readOnly?: boolean
  hideShareSpace?: any
}) => {
  const sidebar = useLayoutStore((state) => state.sidebar)
  // const node = useEditorStore((store) => store.node)
  const toggleSidebar = useLayoutStore((store) => store.toggleSidebar)
  const focusMode = useLayoutStore((state) => state.focusMode)
  const isUserEditing = useEditorStore((store) => store.isEditing)
  const { getFocusProps } = useLayout()
  const inpRef = React.useRef<HTMLInputElement>(null)
  const titleRef = React.useRef<HTMLDivElement>(null)
  const { changeNamespaceName, changeNamespaceIcon } = useNamespaces()
  const [showInput, setShowInput] = useState(false)
  const [title, setTitle] = useState(space?.label)
  const openShareModal = useShareModalStore((store) => store.openModal)
  const { goTo } = useRouting()

  // mog('HEADER IS', { space, inp: inpRef.current, ttle: titleRef.current, title })

  const onTagClick = (tag: string) => {
    goTo(ROUTE_PATHS.tag, NavigationType.push, tag)
  }

  useEffect(() => {
    setTitle(space?.label)
  }, [space])

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
      changeNamespaceName(space?.id, name).then((res) => {
        if (res === undefined) {
          setTitle(space?.label)
        }
      })
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

  const onChangeIcon = async (icon: MIcon) => {
    return await changeNamespaceIcon(space?.id, space?.label, icon)
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

  const isNamespaceReadonly = space?.data?.access === 'READ'
  const isNamespaceInputDisabled = isNamespaceReserved || isNamespaceReadonly || readOnly
  const isNamespaceIconDisabled = isNamespaceReserved || isNamespaceReadonly || readOnly
  const isShared = space?.data?.granterID !== undefined
  const isReadonly = space?.data?.access === 'READ'
  const isWriteOnly = space?.data?.access === 'WRITE'
  const showTags = space?.popularTags && space?.popularTags.length > 0
  const showSeparator = showTags

  const shareSpaceTooltip = () => {
    if (isWriteOnly) return "You don't have share permission"
    if (isReadonly) return 'You can only read the contents!'
    return 'Share Space'
  }

  return (
    <>
      <SpaceHeader>
        <SpaceTitleWrapper>
          <SpaceTitle>
            <IconPicker
              key={space?.id}
              size={20}
              allowPicker={!isNamespaceIconDisabled}
              onChange={onChangeIcon}
              value={space?.icon}
            />
            {showInput && !isNamespaceInputDisabled ? (
              <Input defaultValue={space?.label} onBlur={(e) => onChangeName(e.target.value)} ref={inpRef} />
            ) : (
              <Tooltip content={readOnly ? 'Space Name' : `Rename ${title}`}>
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
          {!isNamespaceReserved && !hideShareSpace && (
            <VisibleFade visible={!isUserEditing}>
              <IconButton
                // highlight={isShared && !isReadonly && !isWriteOnly}
                title={shareSpaceTooltip()}
                icon={isReadonly ? 'ri:eye-line' : 'ri:share-line'}
                disabled={isWriteOnly}
                onClick={isReadonly ? undefined : onShareSpace}
              />
            </VisibleFade>
          )}
          <Tippy
            theme="mex-bright"
            placement="right"
            content={<TitleWithShortcut title={sidebar?.expanded ? 'Collapse Sidebar' : 'Expand Sidebar'} />}
          >
            <SidebarToggle isVisible={!isUserEditing} onClick={toggleSidebar} {...getFocusProps(focusMode)}>
              <Icon
                icon={sidebar.expanded ? 'heroicons-solid:chevron-double-left' : 'heroicons-solid:chevron-double-right'}
              />
            </SidebarToggle>
          </Tippy>
        </SpaceTitleWrapper>
        {/*space.pinnedItems && <space.pinnedItems />*/}
        {showTags && <TagsLabel tags={space?.popularTags} onClick={onTagClick} />}
      </SpaceHeader>
      {showSeparator && <SpaceSeparator />}
    </>
  )
}

export default Header
