import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { MentionStore, useMentionStoreConstructor } from '@mexit/core'

import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'


export const useMentionStore = create<MentionStore>(
  devtools(
    persist(
      useMentionStoreConstructor,
      { name: 'mexit-mentions-store', getStorage: () => asyncLocalStorage }
    ),
    { name: 'Mention Store' }
  )
)

export const getUserFromUseridHookless = (userid: string) => {
  const mentionable = useMentionStore.getState().mentionable

  const user = mentionable.find((user) => user.id === userid)

  if (user) return user
}
