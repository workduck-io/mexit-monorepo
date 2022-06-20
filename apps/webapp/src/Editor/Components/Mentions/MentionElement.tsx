import React from 'react'
import Tippy from '@tippyjs/react/headless' // different import path!
import { Transforms } from 'slate'
import { useFocused, useSelected } from 'slate-react'
import { MentionElementProps, useEditorRef } from '@udecode/plate'

import { mog, Mentionable, InvitedUser, AccessLevel } from '@mexit/core'

import AccessTag from '../../../Components/Mentions/AccessTag'
import { ProfileImage } from '../../../Components/User/ProfileImage'
import { useHotkeys } from '../../../Hooks/useHotkeys'
import { useMentions } from '../../../Hooks/useMentions'
import { useOnMouseClick } from '../../../Hooks/useOnMouseClick'
import { useEditorStore } from '../../../Stores/useEditorStore'
import { MentionTooltip, TooltipMail, SMentionRoot, SMention, Username } from '../../Styles/Mentions'

// import { MentionTooltip, SMention, SMentionRoot, TooltipMail, Username } from './MentionElement.styles'

interface MentionTooltipProps {
  user?: Mentionable | InvitedUser
  access?: AccessLevel
}

const MentionTooltipComponent = ({ user, access }: MentionTooltipProps) => {
  return (
    <MentionTooltip>
      <ProfileImage email={user && user.email} size={64} />
      <div>{user && user.alias}</div>
      {/* <div>State: {user?.type ?? 'Missing'}</div> */}
      {access && <AccessTag access={access} />}
      <TooltipMail>{user && user.email}</TooltipMail>
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
  const { getUserFromUserid, getUserAccessLevelForNode } = useMentions()

  const onClickProps = useOnMouseClick(() => {
    mog('Mention has been clicked yo', { val: element.value })
    // openTag(element.value)
  })

  const user = getUserFromUserid(element.value)
  const access = getUserAccessLevelForNode(element.value, node.nodeid)

  // mog('MentionElement', { user })

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

  mog('MentionElement', { user, access, node })

  return (
    <SMentionRoot {...attributes} data-slate-value={element.value} contentEditable={false}>
      <Tippy
        delay={100}
        interactiveDebounce={100}
        placement="bottom"
        appendTo={() => document.body}
        render={(attrs) => <MentionTooltipComponent user={user} access={access} />}
      >
        <SMention {...onClickProps} selected={selected}>
          <Username>@{user?.alias ?? element.value}</Username>
        </SMention>
      </Tippy>
      {children}
    </SMentionRoot>
  )
}
