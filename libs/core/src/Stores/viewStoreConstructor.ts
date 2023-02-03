export const viewStoreConstructor = (set) => ({
  views: [],
  currentView: undefined,
  _hasHydrated: false,
  setHasHydrated: (state) => {
    set({
      _hasHydrated: state
    })
  },
  clear: () => set({ views: [], currentView: undefined }),
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
