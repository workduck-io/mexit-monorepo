import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { IDBStorage, MentionStore, useMentionStoreConstructor } from '@mexit/core'

export const useMentionStore = create<MentionStore>(
  devtools(persist(useMentionStoreConstructor, { name: 'mexit-mentions-store', getStorage: () => IDBStorage }), {
    name: 'Mention Store'
  })
)

export const getUserFromUseridHookless = (userId: string) => {
  const mentionable = useMentionStore.getState().mentionable

  const user = mentionable.find((user) => user.id === userId)

  if (user) return user
}
