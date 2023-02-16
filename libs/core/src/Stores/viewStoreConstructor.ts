const getDefaultViewStoreState = () => ({
  views: [],
  currentView: undefined
})

export const viewStoreConstructor = (set) => ({
  ...getDefaultViewStoreState(),
  _hasHydrated: false,
  setHasHydrated: (state) => {
    set({
      _hasHydrated: state
    })
  },
  clear: () => set(getDefaultViewStoreState()),
  setCurrentView: (view) =>
    set((state) => ({
      ...state,
      currentView: view
    })),
  setViews: (views) =>
    set((state) => ({
      ...state,
      views
    })),
  addView: (view) =>
    set((state) => ({
      ...state,
      views: [...state.views.filter((v) => v.id !== view.id), view]
    })),
  removeView: (id) =>
    set((state) => ({
      ...state,
      views: state.views.filter((v) => v.id !== id)
    })),
  updateView: (view) =>
    set((state) => ({
      ...state,
      views: state.views.map((v) => (v.id === view.id ? view : v))
    }))
})
