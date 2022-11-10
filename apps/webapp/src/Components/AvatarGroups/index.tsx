import React from 'react'

import { ProfileAvatar } from '../User/ProfileImage'
import { AvatarGroupContainer, ProfileAvatarContainer } from './styled'

type UserAvatarType = {
  userId: string
  active?: boolean
  shared?: boolean
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
        if (user)
          return (
            <ProfileAvatarContainer offline={!user.active} key={`mex-user-${user.userId}${index}`}>
              <ProfileAvatar userId={user.userId} size={20} />
            </ProfileAvatarContainer>
          )
        return <></>
      })}
    </AvatarGroupContainer>
  )
}

export default AvatarGroups
