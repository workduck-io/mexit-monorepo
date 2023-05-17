import { useEffect, useMemo, useState } from 'react'

import styled from 'styled-components'

import { Button } from '@workduck-io/mex-components'

import { API, API_BASE_URLS, useInviteStore } from '@mexit/core'
import { CopyButton, copyTextToClipboard, Group, ProfileContainer, Title } from '@mexit/shared'

import { DeletionWarning } from '../../Components/Modals/DeleteSpaceModal/styled'
import { ROUTE_PATHS } from '../../Hooks/useRouting'

import Members from './Workspace/Members'
import WorkspaceDetails from './Workspace/WorkspaceDetails'
import { InviteCode, InviteContainer, SettingsCardContainer, SmallHeading } from './styled'

const Margin = styled.div`
  margin: 0.5rem 1rem;
`

const Invite = () => {
  const [members, setMembers] = useState([])

  useEffect(() => {
    async function getInvites() {
      const invites = await API.invite.getAll()
      useInviteStore.getState().setInvites(invites)
    }

    async function getAllUsers() {
      const users = await API.user.getAllUsersOfWorkspace()
      setMembers(users)
    }

    getInvites()
    getAllUsers()
  }, [])

  const invites = useInviteStore((store) => store.invites)
  const addInvite = useInviteStore((store) => store.addInvite)

  const inviteUser = async () => {
    const invite = await API.invite.create({})
    addInvite(invite)
  }

  const handleCopy = (invite: string) => {
    if (!invite) return
    copyTextToClipboard(invite, 'Invite code copied to clipboard')
  }

  const invite = useMemo(() => {
    const code = invites?.at(0)?.id
    const url = `${API_BASE_URLS.frontend}${ROUTE_PATHS.workspace}/join?invite=${code}`

    return { code, url }
  }, [invites])

  return (
    <ProfileContainer>
      <SettingsCardContainer>
        <Title noMargin>Workspace</Title>
        <WorkspaceDetails />
        <InviteContainer>
          <SmallHeading>Invite</SmallHeading>
          <DeletionWarning>
            Invite your team members to your workspace. They will be able to join your workspace by entering the invite
            code
          </DeletionWarning>
          <Margin />
          <Group>
            <InviteCode onClick={() => handleCopy(invite.code)}>
              {invite.code ?? 'Generate a new invite code'}
            </InviteCode>
            {invite.code && <CopyButton text={invite.url} size="20" />}{' '}
            <Button onClick={inviteUser}>Create Invite</Button>
          </Group>
        </InviteContainer>
        <Members members={members} />
      </SettingsCardContainer>
    </ProfileContainer>
  )
}

export default Invite
