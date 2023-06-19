import { AIEvent, StoreIdentifier } from '../Types'
import { createStore } from '../Utils/storeCreator'

interface Chat {
  [nodeId: string]: AIEvent[]
}

export const chatStoreConfig = (set, get) => ({
  chat: {} as Chat,
  getChat: (nodeId: string) => {
    return get().chat[nodeId]
  },
  addChat: (nodeId: string, aiHistory: AIEvent[]) =>
    set({
      chat: {
        ...get().chat,
        [nodeId]: aiHistory
      }
    }),
  clearIndividualChat: (nodeId: string) => {
    const _previousChats = get().chat

    delete _previousChats[nodeId]
  },
  reset: () => {
    set({ chat: {} })
  }
})

export const useChatStore = createStore(chatStoreConfig, StoreIdentifier.CHAT, false)
