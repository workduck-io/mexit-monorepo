import React from 'react'

import { CopyButton } from '../Buttons/CopyButton'
import { ProfileImage } from './ProfileImage'
import { useAuthStore } from '../../Stores/useAuth'
import { BackCard } from '../../Style/Card'
import { CenteredColumn } from '../../Style/Layouts'
import { Title } from '../../Style/Typography'
import { Info, InfoData, InfoLabel, ProfileContainer, ProfileIcon } from '../../Style/UserPage'

const UserPage = () => {
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const userDetails = useAuthStore((store) => store.userDetails)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  console.log({ userDetails })

  return (
    <CenteredColumn>
      <BackCard>
        <ProfileContainer>
          <ProfileIcon>
            <ProfileImage email={userDetails?.email} size={128} />
          </ProfileIcon>
          <div>
            <Title>User</Title>
            <Info>
              <InfoLabel>Email:</InfoLabel>
              <InfoData>{userDetails?.email}</InfoData>
            </Info>
            <Info>
              <InfoLabel>Workspace:</InfoLabel>
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
