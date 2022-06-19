import create from 'zustand'

import { mentionables } from '../Data/defaultMentions'
import { InvitedUser, Mentionable, AccessLevel } from '../Types/Mentions'

interface MentionStore {
  invitedUsers: InvitedUser[]
  mentionable: Mentionable[]
  addInvitedUser: (invitedUser: InvitedUser) => void
  addAccess: (email: string, nodeid: string, accessLevel: AccessLevel) => void
  setMentionable: (mentionable: Mentionable[]) => void
}

export const useMentionStore = create<MentionStore>((set, get) => ({
  invitedUsers: [],
  mentionable: mentionables,
  addInvitedUser: (invitedUser: InvitedUser) => {
    const exists = get().invitedUsers.find((user) => user.email === invitedUser.email)
    if (!exists) {
      set({
        invitedUsers: [...get().invitedUsers, invitedUser]
      })
    }
  },
  addAccess: (email: string, nodeid: string, accessLevel: AccessLevel) => {
    const invitedExists = get().invitedUsers.find((user) => user.email === email)
    const mentionExists = get().mentionable.find((user) => user.email === email)
    if (invitedExists && !mentionExists) {
      const newInvited: InvitedUser = addAccessToUser(invitedExists, nodeid, accessLevel)
      set({
        invitedUsers: [...get().invitedUsers.filter((user) => user.email !== email), newInvited]
      })
    } else if (!invitedExists && mentionExists) {
      // We know it is guaranteed to be mentionable
      const newMentioned: Mentionable = addAccessToUser(mentionExists, nodeid, accessLevel) as Mentionable
      set({
        mentionable: [...get().mentionable.filter((user) => user.email !== email), newMentioned]
      })
    } else {
      return
    }
  },
  setMentionable: (mentionable) =>
    set({
      mentionable
    })
}))

export const addAccessToUser = (user: any, nodeid: string, accessLevel: AccessLevel) => {
  const access = user.access || {}
  access[nodeid] = accessLevel
  user.access = access
  return user
}

export const getUserFromUseridHookless = (userid: string) => {
  const mentionable = useMentionStore.getState().mentionable

  const user = mentionable.find((user) => user.userid === userid)

  if (user) return user
}
