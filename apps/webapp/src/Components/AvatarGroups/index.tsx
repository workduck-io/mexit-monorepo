import React from 'react'

import { AccessLevel, mog } from '@mexit/core'

import { ProfileImageWithToolTip } from '../User/ProfileImage'
import { AvatarGroupContainer, ProfileAvatarContainer } from './styled'

type UserAvatarType = {
  userId: string
  active?: boolean
  access?: AccessLevel
}

type AvatarGroupsPropsType = {
  limit: number
  users: Array<UserAvatarType>
  margin?: string
}

const AvatarGroups: React.FC<AvatarGroupsPropsType> = ({ users, margin, limit = 5 }) => {
  const list = users.slice(0, limit)

  if (!list?.length) return <></>

  return (
    <AvatarGroupContainer margin={margin}>
      {list.map((user, index) => {
        if (user) {
          return (
            <ProfileAvatarContainer offline={!user.active} key={`mex-user-${user.userId}${index}`}>
              <ProfileImageWithToolTip
                interactive
                placement="bottom"
                props={{ access: user.access, userid: user.userId, size: 20 }}
              />
            </ProfileAvatarContainer>
          )
        }

        return <></>
      })}
    </AvatarGroupContainer>
  )
}

export default AvatarGroups
