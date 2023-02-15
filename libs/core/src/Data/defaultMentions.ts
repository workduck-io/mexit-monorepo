import { InvitedUser, Mentionable } from '../Types/Mentions'

const randomUser = (s: string) => ({
  type: 'mentionable' as const,
  id: `USER_${s}`,
  alias: s,
  email: `${s}@gmail.com`,
  name: s.toUpperCase(),
  access: {
    note: {
      NODE_3WMXYjqUi8afVQwyG96df: 'READ' as const
    },
    space: {}
  }
})

const inviteUser = (s: string) => ({
  type: 'invite' as const,
  alias: s,
  email: `${s}@gmail.com`,
  access: { note: {}, space: {} }
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
