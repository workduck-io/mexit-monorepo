import { View } from '../Types/View'

const getDefaultViewStoreState = () => ({
  views: [] as View[],
  currentView: undefined
})

export const viewStoreConstructor = (set, get) => ({
  ...getDefaultViewStoreState(),
  _hasHydrated: false,
  setHasHydrated: (state) => {
    set({
      _hasHydrated: state
    })
  },
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
