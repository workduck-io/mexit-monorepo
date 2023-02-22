import {
  AccessLevel,
  InvitedUser,
  Mentionable,
  ShareContext,
  useMentionStore as mentionStore,
  UserAccessTable
} from '@mexit/core'

interface MentionStore {
  invitedUsers: InvitedUser[]
  mentionable: Mentionable[]
  addInvitedUser: (invitedUser: InvitedUser) => void
  addAccess: (email: string, id: string, context: ShareContext, accessLevel: AccessLevel) => void
  addMentionable: (mentionable: Mentionable) => void
  initMentionData: (mentionable: Mentionable[], invitedUser: InvitedUser[]) => void
  setInvited: (invitedUsers: InvitedUser[]) => void
  setMentionable: (mentionable: Mentionable[]) => void
  reset: () => void
}

export const addAccessToUser = (user: any, id: string, context: ShareContext, accessLevel: AccessLevel) => {
  const access: UserAccessTable = user.access || {
    note: {},
    space: {}
  }
  access[context][id] = accessLevel
  user.access = access
  return user
}

export const useMentionStore = mentionStore

export const getUserFromUseridHookless = (userId: string) => {
  const mentionable = useMentionStore.getState().mentionable

  const user = mentionable.find((user) => user.id === userId)

  if (user) return user
}
