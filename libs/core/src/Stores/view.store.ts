import { StoreIdentifier } from '../Types/Store'
import { View } from '../Types/View'
import { createStore } from '../Utils/storeCreator'

const getDefaultViewStoreState = () => ({
  views: [] as View[],
  currentView: undefined
})

export const viewStoreConfig = (set, get) => ({
  ...getDefaultViewStoreState(),
  clear: () => set(getDefaultViewStoreState()),
  setCurrentView: (view: View) =>
    set((state) => ({
      ...state,
      currentView: view
    })),
  setViews: (views: View[]) =>
    set((state) => ({
      ...state,
      views
    })),
  addView: (view: View) => {
    const existing = get().views
    set({ views: [...existing.filter((v) => v.id !== view.id), view] })
  },
  removeView: (id: string) => {
    const existing = get().views
    set({ views: [...existing.filter((v) => v.id !== id)] })
  },
  updateView: (view: View) => {
    const existing = get().views
    set({ views: [...existing.filter((v) => v.id !== view.id), view] })
  }
})

export const useViewStore = createStore(viewStoreConfig, StoreIdentifier.VIEW, true, {
  storage: {
    web: typeof window !== 'undefined' ? localStorage : undefined
  }
})
