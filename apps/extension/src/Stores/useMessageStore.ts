import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { SocketMessage } from '@mexit/core'

import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'

interface MessagesStore {
  messages: SocketMessage[]
  addMessage: (message: SocketMessage) => void
  removeMessage: (messageId: string) => void
}

export const useMessagesStore = create<MessagesStore>()(
  persist(
    (set, get) => ({
      messages: [],
      addMessage: (message) => {
        set({
          messages: [...get().messages, message]
        })
      },
      removeMessage: (messageId) => {
        const filteredMessages = get().messages.filter((item) => item.id !== messageId)

        set({
          messages: filteredMessages
        })
      }
    }),
    { name: 'mexit-messages', getStorage: () => asyncLocalStorage }
  )
)
