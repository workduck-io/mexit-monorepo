import React from 'react'

import { CopyButton } from '../Buttons/CopyButton'
import { ProfileImage } from './ProfileImage'
import { useAuthStore } from '../../Stores/useAuth'
import { BackCard } from '../../Style/Card'
import { CenteredColumn } from '../../Style/Layouts'
import { Title } from '../../Style/Typography'
import { Info, InfoData, InfoLabel, ProfileContainer, ProfileIcon } from '../../Style/UserPage'
import { Button } from '../../Style/Buttons'
import { useApi } from '../../Hooks/useApi'

const UserPage = () => {
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const userDetails = useAuthStore((store) => store.userDetails)

  const { getGoogleAuthUrl } = useApi()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  const handleGoogleAuthUrl = async () => {
    const googleAuthUrl = await getGoogleAuthUrl()
    window.open(googleAuthUrl, '_blank', 'width=1000,height=1000')
    // TODO: fetch the google refresh token from the auth service and set in the local auth store
  }

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
            <Button onClick={handleGoogleAuthUrl}>Authorize Google Calendar</Button>
          </div>
        </ProfileContainer>
      </BackCard>
    </CenteredColumn>
  )
}

export default UserPage
