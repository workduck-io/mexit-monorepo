import React, { useMemo, useEffect } from 'react'
import toast from 'react-hot-toast'
import Tippy from '@tippyjs/react/headless' // different import path!
import { Transforms } from 'slate'
import { useFocused, useSelected } from 'slate-react'
import { MentionElementProps, useEditorRef } from '@udecode/plate'

import { mog, Mentionable, InvitedUser, AccessLevel, SelfMention } from '@mexit/core'
import { Button } from '@mexit/shared'

import AccessTag from '../../../Components/Mentions/AccessTag'
import { ProfileImage } from '../../../Components/User/ProfileImage'
import { useHotkeys } from '../../../Hooks/useHotkeys'
import { useMentions } from '../../../Hooks/useMentions'
import { useOnMouseClick } from '../../../Hooks/useOnMouseClick'
import { useEditorStore } from '../../../Stores/useEditorStore'
import {
  MentionTooltip,
  TooltipMail,
  SMentionRoot,
  SMention,
  Username,
  MentionTooltipContent,
  TooltipAlias
} from '../../Styles/Mentions'
import { useShareModalStore } from '../../../Stores/useShareModalStore'
import { Icon } from '@iconify/react'
import { useMentionStore } from '../../../Stores/useMentionsStore'
import { useUserCacheStore } from '../../../Stores/useUserCacheStore'
import { useUserService } from '../../../Hooks/API/useUserAPI'

// import { MentionTooltip, SMention, SMentionRoot, TooltipMail, Username } from './MentionElement.styles'

interface MentionTooltipProps {
  user?: Mentionable | InvitedUser | SelfMention
  nodeid: string
  access?: AccessLevel
}

const MentionTooltipComponent = ({ user, access, nodeid }: MentionTooltipProps) => {
  const prefillShareModal = useShareModalStore((state) => state.prefillModal)

  const onShareModal = async () => {
    // mog('onShareModal')
    // TODO: Extract new permission from Val
    if (user?.type === 'self') {
      toast('Changing your own permission is not allowed')
    }
    if (user?.type === 'mentionable') {
      prefillShareModal('invite', {
        userid: user?.userID
      })
    }
  }

  return (
    <MentionTooltip>
      <ProfileImage email={user && user.email} size={128} />
      <MentionTooltipContent>
        {user && user.type !== 'invite' && (
          <div>
            {user.name}
            {user.type === 'self' && '(you)'}
          </div>
        )}
        {user && user.alias && <TooltipAlias>@{user.alias}</TooltipAlias>}
        <TooltipMail>{user && user.email}</TooltipMail>
        {access && <AccessTag access={access} />}
        {user && user?.type !== 'invite' && user?.type !== 'self' && !access && (
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
        Transforms.move(editor)
      }
    },
    [selected, focused]
  )

  useHotkeys(
    'delete',
    () => {
      if (selected && focused && editor.selection) {
        // mog('delete', { selected, focused, sel: editor.selection })
        Transforms.move(editor, { reverse: true })
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
        render={(attrs) => <MentionTooltipComponent user={user} nodeid={node.nodeid} access={access} />}
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
