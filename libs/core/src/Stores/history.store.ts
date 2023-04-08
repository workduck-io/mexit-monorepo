import { AIEvent, AIEventsHistory } from '../Types/History'
import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

const MAX_HISTORY_SIZE = 25

export const historyStoreConfig = (set, get) => ({
  stack: [] as Array<string>,
  currentNodeIndex: -1,
  ai: [] as AIEventsHistory,
  activeEventIndex: -1,
  setActiveEventIndex: (index: number) => set({ activeEventIndex: index }),
  addInitialEvent: (event: AIEvent) => {
    set({ ai: [[event, undefined]] })
  },
  addInAIHistory: (userQuery: AIEvent, assistantResponse: AIEvent) => {
    const aiEventsHistory = get().ai as AIEventsHistory
    const activeEventIndex = get().activeEventIndex
    const lastEvent = aiEventsHistory.at(activeEventIndex)?.[0]
    set({
      ai: [...aiEventsHistory.slice(0, activeEventIndex), [lastEvent, userQuery], [assistantResponse, undefined]],
      activeEventIndex: -1
    })
  },
  clearAIResponses: () => {
    const aiEventsHistory = get().ai as AIEventsHistory
    if (aiEventsHistory?.length) {
      const initialEvent = aiEventsHistory[0]
      set({ ai: [[initialEvent[0], undefined]], activeEventIndex: -1 })
    }
  },
  clearAIHistory: () => set({ ai: [], activeEventIndex: -1 }),
  getLastEvent: (): string | undefined => {
    const aiHistory = get().ai as AIEventsHistory
    const lastEvent = aiHistory.at(-1)?.at(-1)

    return lastEvent?.content
  },

  /**
   * Push will remove all elements above the currentNodeIndex
   */
  replace: (nodeId: string) => {
    set((state) => {
      const historyStack = state.stack.slice(0)
      const lastElement = historyStack[historyStack.length - 1]

      if (lastElement === nodeId) return
      historyStack[historyStack.length - 1] = nodeId

      return {
        stack: historyStack
      }
    })
  },
  push: (nodeId: string) =>
    set((state) => {
      let newIndex = state.currentNodeIndex + 1
      const remainingStack = state.stack.slice(0, newIndex)
      // Don't append if same as current nodeId
      if (remainingStack[remainingStack.length - 1] === nodeId) return
      remainingStack.push(nodeId)
      // Update index if large
      if (remainingStack.length > MAX_HISTORY_SIZE) {
        newIndex = MAX_HISTORY_SIZE - 1
      }
      // Trim till the last 25
      const resizedArr = remainingStack.slice(-MAX_HISTORY_SIZE)
      return {
        stack: resizedArr,
        currentNodeIndex: newIndex
      }
    }),
  move: (distance: number) =>
    set((state) => {
      const newIndex = state.currentNodeIndex + distance

      if (newIndex >= 0 && newIndex < state.stack.length) {
        return {
          currentNodeIndex: newIndex
        }
      }
    }),
  update: (stack: Array<string>, currentNodeIndex: number) =>
    set({
      stack,
      currentNodeIndex
    }),
  getCurrentUId: (): string | undefined => {
    const curIndex = get().currentNodeIndex
    if (curIndex >= 0 && curIndex < get().stack.length) {
      return get().stack[curIndex]
    }
    return undefined
  }
})

export const useHistoryStore = createStore(historyStoreConfig, StoreIdentifier.HISTORY, false)
