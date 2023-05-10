import { useEffect } from 'react'

import styled from 'styled-components'

import { Button } from '@workduck-io/mex-components'

import { API, useInviteStore, useUserCacheStore } from '@mexit/core'
import { BackCard, CenteredColumn, Group, List, Title } from '@mexit/shared'

const Margin = styled.div`
  margin: 0.5rem 1rem;
`

const Invite = () => {
  useEffect(() => {
    async function getInvites() {
      const invites = await API.invite.getAll()
      useInviteStore.getState().setInvites(invites)
    }

    async function getAllUsers() {
      const users = await API.user.getAllUsersOfWorkspace()
      console.log('USERS', { users })
    }

    getInvites()
    getAllUsers()
  }, [])

  const users = useUserCacheStore((store) => store.cache)
  const invites = useInviteStore((store) => store.invites)
  const addInvite = useInviteStore((store) => store.addInvite)

  const inviteUser = async () => {
    const invite = await API.invite.create({})
    addInvite(invite)
  }

  return (
    <CenteredColumn>
      <BackCard>
        <Title colored>Mexit</Title>
        <Margin>
          {invites.map((invite) => (
            <List>{invite.id}</List>
          ))}
        </Margin>
        <Margin>
          {users.map((item) => {
            return <Group>{item.name}</Group>
          })}
        </Margin>
        <Button onClick={inviteUser}>Create Invite</Button>
        <br />
      </BackCard>
    </CenteredColumn>
  )
}

export default Invite
