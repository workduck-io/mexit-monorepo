import { InvitedUser, Mentionable } from '@mexit/core'

const randomUser = (s: string) => ({
  type: 'mentionable' as const,
  userID: `USER_${s}`,
  alias: s,
  email: `${s}@gmail.com`,
  name: s.toUpperCase(),
  access: {
    NODE_3WMXYjqUi8afVQwyG96df: 'READ' as const
  }
})

const inviteUser = (s: string) => ({
  type: 'invite' as const,
  alias: s,
  email: `${s}@gmail.com`,
  access: {}
})

const randomUsers = ['alice', 'bob', 'charlie', 'dave', 'xypnox']

const invitedUsers = ['zavier', 'xavoier', 'yavoier', 'zavoier']

export const invited: InvitedUser[] = invitedUsers.map(inviteUser)

export const mentionables: Mentionable[] = randomUsers.map(randomUser)

export const AccessNames = {
  READ: 'View',
  WRITE: 'Edit',
  MANAGE: 'Manage',
  OWNER: 'Owner'
}