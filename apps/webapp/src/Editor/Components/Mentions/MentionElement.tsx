import React, { useMemo } from 'react'
import Tippy from '@tippyjs/react/headless' // different import path!
import { Transforms } from 'slate'
import { useFocused, useSelected } from 'slate-react'
import { MentionElementProps, useEditorRef } from '@udecode/plate'
import toast from 'react-hot-toast'

import { mog, Mentionable, InvitedUser, AccessLevel, permissionOptions, SelfMention } from '@mexit/core'
import { StyledCreatatbleSelect } from '@mexit/shared'

import AccessTag from '../../../Components/Mentions/AccessTag'
import { ProfileImage } from '../../../Components/User/ProfileImage'
import { useHotkeys } from '../../../Hooks/useHotkeys'
import { useMentions } from '../../../Hooks/useMentions'
import { useOnMouseClick } from '../../../Hooks/useOnMouseClick'
import { useEditorStore } from '../../../Stores/useEditorStore'
import { MentionTooltip, TooltipMail, SMentionRoot, SMention, Username } from '../../Styles/Mentions'
import { useMentionStore } from '../../../Stores/useMentionsStore'
import { usePermission } from '../../../Hooks/API/usePermission'

// import { MentionTooltip, SMention, SMentionRoot, TooltipMail, Username } from './MentionElement.styles'

interface MentionTooltipProps {
  user?: Mentionable | InvitedUser | SelfMention
  nodeid: string
  access?: AccessLevel
}

const MentionTooltipComponent = ({ user, access, nodeid }: MentionTooltipProps) => {
  const addAccess = useMentionStore((s) => s.addAccess)
  const { changeUserPermission } = usePermission()

  const onAccessChange = async (val: any) => {
    mog('Val', val)
    // TODO: Extract new permission from Val
    if (user?.type === 'self') {
      toast('Changing your own permission is not allowed')
    }
    if (user?.type === 'mentionable') {
      // Grant permission via api
      const resp = await changeUserPermission(nodeid, { [user.userID]: access }) // Use new permission instead of acces here
    }
    addAccess(user?.email, nodeid, access)
  }

  return (
    <MentionTooltip>
      <ProfileImage email={user && user.email} size={64} />
      <div>{user && user.alias}</div>
      {/* <div>State: {user?.type ?? 'Missing'}</div> */}
      {access && <AccessTag access={access} />}
      {access && (
        <StyledCreatatbleSelect
          defaultValue={permissionOptions.find((p) => p.value === access)}
          options={permissionOptions}
          onChange={(val) => onAccessChange(val)}
          closeMenuOnSelect={true}
          closeMenuOnBlur={true}
        />
      )}
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

  const user = useMemo(() => {
    const u = getUserFromUserid(element.value)
    if (u) return u

    if (element.email)
      return {
        type: 'invite' as const,
        email: element.email,
        alias: element.value,
        access: {}
      } as InvitedUser
  }, [element.value])
  const access = getUserAccessLevelForNode(element.value, node.nodeid)

  // mog('MentionElement', { user, access, node, elementEmail: element?.email })

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

  return (
    <SMentionRoot {...attributes} type={user?.type} data-slate-value={element.value} contentEditable={false}>
      <Tippy
        delay={100}
        placement="bottom"
        appendTo={() => document.body}
        render={(attrs) => <MentionTooltipComponent user={user} nodeid={node.nodeid} access={access} />}
      >
        <SMention {...onClickProps} type={user?.type} selected={selected}>
          <Username>@{user?.alias ?? element.value}</Username>
        </SMention>
      </Tippy>
      {children}
    </SMentionRoot>
  )
}
