import { useEffect, useMemo } from 'react'
import toast from 'react-hot-toast'

import { Icon } from '@iconify/react'
import Tippy from '@tippyjs/react/headless'
import { moveSelection, useEditorRef } from '@udecode/plate'
// different import path!
import { useFocused, useSelected } from 'slate-react'
import styled from 'styled-components'

import { Button } from '@workduck-io/mex-components'

import {
  AccessLevel,
  InvitedUser,
  Mentionable,
  mog,
  SelfMention,
  useEditorStore,
  useMentionStore, 
  useShareModalStore,
  useUserCacheStore} from '@mexit/core'
import {
  AccessTag,
  MentionTooltip,
  MentionTooltipContent,
  SMention,
  SMentionRoot,
  TooltipAlias,
  TooltipMail,
  Username
} from '@mexit/shared'

import { ProfileImage } from '../../../Components/User/ProfileImage'
import { useUserService } from '../../../Hooks/API/useUserAPI'
import { useHotkeys } from '../../../Hooks/useHotkeys'
import { useMentions } from '../../../Hooks/useMentions'
import { useOnMouseClick } from '../../../Hooks/useOnMouseClick'

import { MentionElementProps } from './MentionElement.types'

// import { MentionTooltip, SMention, SMentionRoot, TooltipMail, Username } from './MentionElement.styles'

const Contain = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  height: fit-content;

  & > svg {
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
`

interface MentionTooltipProps {
  user?: Mentionable | InvitedUser | SelfMention
  access?: AccessLevel
  hideAccess?: boolean
}

export const MentionTooltipComponent = ({ user, access, hideAccess }: MentionTooltipProps) => {
  const prefillShareModal = useShareModalStore((state) => state.prefillModal)

  const onShareModal = async () => {
    // mog('onShareModal')
    // TODO: Extract new permission from Val
    if (user?.type === 'self') {
      toast('Changing your own permission is not allowed')
    }
    if (user?.type === 'mentionable') {
      prefillShareModal('invite', 'note', {
        userid: user?.id
      })
    }
  }

  return (
    <MentionTooltip>
      <Contain>
        <ProfileImage email={user && user.email} size={96} />
      </Contain>
      <MentionTooltipContent>
        {user && user.type !== 'invite' && user.name && (
          <Username>
            {user.name}
            {user.type === 'self' && ' (you)'}
          </Username>
        )}
        {user && user.alias && <TooltipAlias>@{user.alias}</TooltipAlias>}
        <TooltipMail>{user && user.email}</TooltipMail>
        {access && <AccessTag access={access} />}
        {user && user?.type !== 'invite' && user?.type !== 'self' && !access && !hideAccess && (
          <Button onClick={onShareModal}>
            <Icon icon="ri:share-line" />
            Share Note
          </Button>
        )}
      </MentionTooltipContent>
    </MentionTooltip>
  )
}

/**
 * MentionElement with no default styles.
 * [Use the `styles` API to add your own styles.](https://github.com/OfficeDev/office-ui-fabric-react/wiki/Component-Styling)
 */
export const MentionElement = ({ attributes, children, element }: MentionElementProps) => {
  const editor = useEditorRef()
  const selected = useSelected()
  const focused = useFocused()
  const node = useEditorStore((state) => state.node)
  const mentionable = useMentionStore((state) => state.mentionable)
  const cache = useUserCacheStore((state) => state.cache)
  const { getUserDetailsUserId } = useUserService()
  const { getUserFromUserid, getUserAccessLevelForNode } = useMentions()
  // const { getUserDetailsUserId } = useUserService()

  const onClickProps = useOnMouseClick(() => {
    mog('Mention has been clicked yo', { val: element.value })
    // openTag(element.value)
  })

  const user = useMemo(() => {
    const u = getUserFromUserid(element.value)
    if (u) return u

    if (element.email)
      return {
        type: 'invite' as const,
        email: element.email,
        alias: element.value,
        // Invited user access map only needed for rendering, does not affect access as it is unknown (for 2nd person view)
        access: {}
      } as InvitedUser
  }, [element.value, mentionable, cache])

  useEffect(() => {
    const _f = (async () => {
      if (!user) await getUserDetailsUserId(element.value)
    })()
  }, [user])

  const access = getUserAccessLevelForNode(element.value, node.nodeid)

  // mog('MentionElement', { user, access })

  useHotkeys(
    'backspace',
    () => {
      if (selected && focused && editor.selection) {
        moveSelection(editor)
      }
    },
    [selected, focused]
  )

  useHotkeys(
    'delete',
    () => {
      if (selected && focused && editor.selection) {
        // mog('delete', { selected, focused, sel: editor.selection })
        moveSelection(editor, { reverse: true })
      }
    },
    [selected, focused]
  )

  // mog('MentionElement', { user, access, node, elementEmail: element?.email })

  return (
    <SMentionRoot {...attributes} type={user?.type} data-slate-value={element.value} contentEditable={false}>
      <Tippy
        // delay={[100, 1000000]} // for testing
        delay={100}
        interactiveDebounce={100}
        interactive
        placement="bottom"
        appendTo={() => document.body}
        render={(attrs) => <MentionTooltipComponent user={user} access={access} />}
      >
        <SMention {...onClickProps} type={user?.type} selected={selected}>
          {user?.email && <ProfileImage email={user?.email} size={16} />}
          <Username>{user?.alias ?? element.value}</Username>
        </SMention>
      </Tippy>
      {children}
    </SMentionRoot>
  )
}
