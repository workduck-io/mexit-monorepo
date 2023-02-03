import { Filter, GlobalFilterJoin, SortOrder, SortType } from './Filters'

export enum ViewType {
  List = 'list',
  Card = 'card',
  Kanban = 'kanban'
}

export interface View {
  title: string
  description?: string
  id: string

  // FIXME: This should use new Filter type
  filters: Filter[]

  viewType?: ViewType
  sortOrder?: SortOrder
  sortType?: SortType

  globalJoin: GlobalFilterJoin
}

export interface ViewStore {
  _hasHydrated: boolean
  setHasHydrated: (state) => void
  clear: () => void
  views: View[]
  currentView: View | undefined
  setCurrentView: (view: View) => void
  setViews: (views: View[]) => void
  addView: (view: View) => void
  removeView: (id: string) => void
  updateView: (view: View) => void
}
