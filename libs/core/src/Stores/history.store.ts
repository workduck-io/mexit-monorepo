import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

const MAX_HISTORY_SIZE = 25

export const historyStoreConfig = (set, get) => ({
  stack: [] as Array<string>,
  currentNodeIndex: -1,

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
