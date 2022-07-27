import create from 'zustand'
import { persist } from 'zustand/middleware'

import { SearchFilter } from '@mexit/core'

export interface View<Item> {
  title: string
  description?: string
  id: string
  filters: SearchFilter<Item>[]
}

export interface ViewStore<Item> {
  views: View<Item>[]
  currentView: View<Item> | undefined
  setCurrentView: (view: View<Item>) => void
  setViews: (views: View<Item>[]) => void
  addView: (view: View<Item>) => void
  removeView: (id: string) => void
  updateView: (view: View<Item>) => void
}

// export const useFilterStoreBase = create<FilterStore<any>>((set) => ({
//   filters: [],
//   currentFilters: [],
//   indexes: ['node', 'shared'],
//   setFilters: (filters) => set((state) => ({ ...state, filters })),
//   setCurrentFilters: (currentFilters) => set((state) => ({ ...state, currentFilters })),
//   setIndexes: (indexes) => set((state) => ({ ...state, indexes }))
// }))

export const useViewStore = create<ViewStore<any>>(
  persist(
    (set) => ({
      views: [],
      currentView: undefined,
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
    }),
    { name: 'mexit-task-view' }
  )
)

export const useTaskViews = () => {
  const getView = (id: string) => {
    const views = useViewStore.getState().views
    return views.find((v) => v.id === id)
  }

  return { getView }
}
