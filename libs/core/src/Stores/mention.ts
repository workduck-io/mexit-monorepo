import merge from 'deepmerge'
import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { AccessLevel, InvitedUser, Mentionable, ShareContext, UserAccessTable } from '../Types/Mentions'
import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'
import { IDBStorage } from '../Utils/idbStorageAdapter'
import { mog } from '../Utils/mog'

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

export const mentionStoreConstructor = (set, get): MentionStore => ({
  invitedUsers: [],
  mentionable: [],
  reset: () => set({ invitedUsers: [], mentionable: [] }),
  addMentionable: (mentionable: Mentionable) => {
    const exists = get().mentionable.find((user) => user.email === mentionable.email)
    mog('addMentionable', { mentionable, exists })
    if (!exists) {
      set({
        mentionable: [...get().mentionable, mentionable]
      })
    } else {
      exists.access = merge(exists.access, mentionable.access)
      set({ mentionable: [...get().mentionable.filter((iu) => iu.id !== mentionable.id), exists] })
    }
  },
  addInvitedUser: (invitedUser: InvitedUser) => {
    const exists = get().invitedUsers.find((user) => user.email === invitedUser.email)
    if (!exists) {
      set({
        invitedUsers: [...get().invitedUsers, invitedUser]
      })
    } else {
      exists.access = merge(exists.access, invitedUser.access)
      set({ invitedUsers: [...get().invitedUsers.filter((iu) => iu.email !== invitedUser.email), exists] })
    }
  },
  addAccess: (email: string, id: string, context: ShareContext, accessLevel: AccessLevel) => {
    const invitedExists = get().invitedUsers.find((user) => user.email === email)
    const mentionExists = get().mentionable.find((user) => user.email === email)
    if (invitedExists && !mentionExists) {
      const newInvited: InvitedUser = addAccessToUser(invitedExists, id, context, accessLevel)
      set({
        invitedUsers: [...get().invitedUsers.filter((user) => user.email !== email), newInvited]
      })
      return 'invite'
    } else if (!invitedExists && mentionExists) {
      // We know it is guaranteed to be mentionable
      const newMentioned: Mentionable = addAccessToUser(mentionExists, id, context, accessLevel) as Mentionable
      set({
        mentionable: [...get().mentionable.filter((user) => user.email !== email), newMentioned]
      })
    } else {
      return 'absent'
    }
  },
  initMentionData: (mentionable, invitedUsers) => set({ mentionable, invitedUsers }),
  setInvited: (invitedUsers) =>
    set({
      invitedUsers
    }),
  setMentionable: (mentionable) =>
    set({
      mentionable
    })
})

export const useMentionStore = create<MentionStore>(
  devtools(
    persist(mentionStoreConstructor, {
      name: 'mexit-mentions-store',
      //@ts-ignore
      getStorage: () => (chrome.storage ? asyncLocalStorage : IDBStorage)
    }),
    {
      name: 'Mention Store'
    }
  )
)

export const addAccessToUser = (user: any, id: string, context: ShareContext, accessLevel: AccessLevel) => {
  const access: UserAccessTable = user.access || {
    note: {},
    space: {}
  }
  access[context][id] = accessLevel
  user.access = access
  return user
}

export const getUserFromUseridHookless = (userId: string) => {
  const mentionable = useMentionStore.getState().mentionable

  const user = mentionable.find((user) => user.id === userId)

  if (user) return user
}
