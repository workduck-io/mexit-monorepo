import React from 'react'

import { CopyButton } from '../Buttons/CopyButton'
import { ProfileImage } from './ProfileImage'
import { useAuthStore } from '../../Stores/useAuth'
import { BackCard } from '@mexit/shared'
import { Info, InfoData, InfoLabel, ProfileContainer, ProfileIcon } from '@mexit/shared'
import { CenteredColumn, Title } from '@mexit/shared'

const UserPage = () => {
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const currentUserDetails = useAuthStore((store) => store.userDetails)

  return (
    <CenteredColumn>
      <BackCard>
        <ProfileContainer>
          <ProfileIcon>
            <ProfileImage email={currentUserDetails?.email} size={128} />
          </ProfileIcon>
          <div>
            <Title>User</Title>
            <Info>
              <InfoLabel>Name</InfoLabel>
              <InfoData>{currentUserDetails?.name}</InfoData>
            </Info>
            <Info>
              <InfoLabel>Email</InfoLabel>
              <InfoData>{currentUserDetails?.email}</InfoData>
            </Info>
            <Info>
              <InfoLabel>Alias</InfoLabel>
              <InfoData>{currentUserDetails?.alias ?? 'Warning: Unset'}</InfoData>
            </Info>
            <Info>
              <InfoLabel>Workspace</InfoLabel>
              <InfoData small>
                <CopyButton text={getWorkspaceId()}></CopyButton>
                {getWorkspaceId()}
              </InfoData>
            </Info>
          </div>
        </ProfileContainer>
      </BackCard>
    </CenteredColumn>
  )
}

export default UserPage
