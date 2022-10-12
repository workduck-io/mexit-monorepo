import React, { useEffect } from 'react'

import create from 'zustand'

import { Filter, GlobalFilterJoin, mog } from '@mexit/core'

import { useViewAPI } from './API/useViewsAPI'

export interface View {
  title: string
  description?: string
  id: string

  // FIXME: This should use new Filter type
  filters: Filter[]

  globalJoin: GlobalFilterJoin
}

export interface ViewStore {
  views: View[]
  currentView: View | undefined
  setCurrentView: (view: View) => void
  setViews: (views: View[]) => void
  addView: (view: View) => void
  removeView: (id: string) => void
  updateView: (view: View) => void
}

// export const useFilterStoreBase = create<FilterStore<any>>((set) => ({
//   filters: [],
//   currentFilters: [],
//   indexes: ['node', 'shared'],
//   setFilters: (filters) => set((state) => ({ ...state, filters })),
//   setCurrentFilters: (currentFilters) => set((state) => ({ ...state, currentFilters })),
//   setIndexes: (indexes) => set((state) => ({ ...state, indexes }))
// }))

export const useViewStore = create<ViewStore>((set) => ({
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
}))

export const useTaskViews = () => {
  const addViewStore = useViewStore((store) => store.addView)
  const updateViewStore = useViewStore((store) => store.updateView)
  const removeViewStore = useViewStore((store) => store.removeView)
  const { saveView, deleteView: deleteViewApi } = useViewAPI()

  const getView = (id: string) => {
    const views = useViewStore.getState().views
    return views.find((v) => v.id === id)
  }

  const addView = async (view: View) => {
    const resp = await saveView(view)
    mog('After Svaing that view', { resp })
    addViewStore(view)
  }

  const updateView = async (view: View) => {
    const resp = await saveView(view)
    mog('After update via saving that view', { resp })
    updateViewStore(view)
  }

  const deleteView = async (viewid: string) => {
    const resp = await deleteViewApi(viewid)
    mog('After deleting that view', { resp })
    removeViewStore(viewid)
  }

  return { getView, addView, updateView, deleteView }
}

export const useSyncTaskViews = () => {
  const { getAllViews } = useViewAPI()
  const setViews = useViewStore((store) => store.setViews)

  const fetchAndSetAllViews = async () => {
    try {
      const allViews = await getAllViews()
      if (allViews !== undefined) {
        mog('All Views', { allViews })
        setViews(allViews)
      }
    } catch (e) {
      mog('Error fetching the views', { e })
    }
  }

  useEffect(() => {
    fetchAndSetAllViews()
  }, [])
}
