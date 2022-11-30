import { AccessLevel,InvitedUser, Mentionable, SelfMention } from '@mexit/core'
import { AccessTag,MentionTooltip, MentionTooltipContent, TooltipAlias, TooltipMail } from '@mexit/shared'
import React from 'react'

import { ProfileImage } from './ProfileImage'

interface MentionTooltipProps {
  user?: Mentionable | InvitedUser | SelfMention
  nodeid: string
  access?: AccessLevel
}

export const MentionTooltipComponent = ({ user, access, nodeid }: MentionTooltipProps) => {
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
      </MentionTooltipContent>
    </MentionTooltip>
  )
}
