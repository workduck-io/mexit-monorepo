import { Mentionable, InvitedUser, SelfMention, AccessLevel } from '@mexit/core'
import { MentionTooltip, MentionTooltipContent, TooltipAlias, TooltipMail, AccessTag } from '@mexit/shared'
import React, { useEffect } from 'react'
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
