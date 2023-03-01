import { StoreIdentifier } from "../Types/Store"
import { createStore } from "../Utils/storeCreator"

const MAX_HISTORY_SIZE = 25

export const historyStoreConfig = (set, get) => ({
  stack: [],
  currentNodeIndex: -1,

  /**
   * Push will remove all elements above the currentNodeIndex
   */
  replace: (nodeid) => {
    set((state) => {
      const historyStack = state.stack.slice(0)
      const lastElement = historyStack[historyStack.length - 1]

      if (lastElement === nodeid) return
      historyStack[historyStack.length - 1] = nodeid

      return {
        stack: historyStack
      }
    })
  },
  push: (nodeid) =>
    set((state) => {
      let newIndex = state.currentNodeIndex + 1
      const remainingStack = state.stack.slice(0, newIndex)
      // Don't append if same as current nodeid
      if (remainingStack[remainingStack.length - 1] === nodeid) return
      remainingStack.push(nodeid)
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

  move: (distance) =>
    set((state) => {
      const newIndex = state.currentNodeIndex + distance

      if (newIndex >= 0 && newIndex < state.stack.length) {
        return {
          currentNodeIndex: newIndex
        }
      }
    }),

  update: (stack, currentNodeIndex) =>
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