import { useEffect } from 'react'

import styled from 'styled-components'

import { Button } from '@workduck-io/mex-components'

import { API, mog } from '@mexit/core'
import { BackCard, CenteredColumn, List, Title } from '@mexit/shared'

import { useInviteStore } from '../../Stores/useInviteStore'

// import { APIScratchpad, useAPIScratchpad } from '../../Hooks/API/scratchpad'

const Margin = styled.div`
  margin: 0.5rem 1rem;
`

const Invite = () => {
  useEffect(() => {
    async function getInvites() {
      const invites = await API.invite.getAll()
      useInviteStore.getState().setInvites(invites)
    }
    getInvites()
  }, [])

  const invites = useInviteStore((store) => store.invites)
  const addInvite = useInviteStore((store) => store.addInvite)

  const inviteUser = async () => {
    const invite = await API.invite.create({})
    mog('Invite added', { invite })
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
        <Button onClick={inviteUser}>Create Invite</Button>
        <br />
      </BackCard>
    </CenteredColumn>
  )
}

export default Invite
