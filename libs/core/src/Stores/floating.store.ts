import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

export enum FloatingElementType {
  BALLON_TOOLBAR = 'BALLON_TOOLBAR',
  AI_POPOVER = 'AI_POPOVER'
}

const floatingStoreConfig = (set, get) => ({
  floatingElement: undefined as FloatingElementType | undefined,
  state: {} as Record<FloatingElementType, any>,
  updateFloatingElementState: (floatingElementId: string, state: Record<string, any>) => {
    const existingState = get().state
    set({ state: { ...existingState, [floatingElementId]: { ...existingState[floatingElementId], ...state } } })
  },
  getFloatingElementState: (element: FloatingElementType) => get().state[element],
  setFloatingElement: (element: FloatingElementType, state?: any) => {
    if (state) {
      set({ floatingElement: element, state: { ...get().state, [element]: state } })
    } else {
      const { [element]: _, ...rest } = get().state
      set({ floatingElement: element, state: rest })
    }
  }
})

export const useFloatingStore = createStore(floatingStoreConfig, StoreIdentifier.FLOATING, false)
