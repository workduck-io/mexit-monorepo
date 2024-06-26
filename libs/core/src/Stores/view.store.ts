import { StoreIdentifier } from '../Types/Store'
import { View } from '../Types/View'
import { getLocalStorage } from '../Utils/storage'
import { createStore } from '../Utils/storeCreator'

const getDefaultViewStoreState = () => ({
  views: [] as View[],
  viewSnapshot: {} as Record<string, any>,
  currentView: undefined
})

const viewStoreConfig = (set, get) => ({
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
    const existing = get().views as View[]
    set({ views: [...existing.filter((v) => v.id !== id && !v.path?.includes(id))] })
  },
  updateView: (view: View) => {
    const existing = get().views
    set({ views: [...existing.filter((v) => v.id !== view.id), view] })
  },
  addViewSnapshot: (id: string, snapshot: any) => {
    set({ viewSnapshot: { ...get().viewSnapshot, [id]: snapshot } })
  },
  removeViewSnapshot: (id: string) => {
    const { [id]: _, ...restSnapshots } = get().viewSnapshot

    set({ viewSnapshot: restSnapshots })
  },
  publishView: (id: string, isPublic?: boolean) => {
    const existing = get().views

    set({
      views: existing.map((v) => {
        if (v.id === id) {
          return {
            ...v,
            public: isPublic
          }
        }
        return v
      })
    })
  }
})

export const useViewStore = createStore(viewStoreConfig, StoreIdentifier.VIEW, true, {
  storage: {
    web: getLocalStorage()
  }
})
