import { MexitAction } from '@mexit/shared'
import React, { createContext, useContext, useState } from 'react'

export enum CategoryType {
  quicklink = 'Quick Links',
  action = 'Quick Actions',
  search = 'Search Results'
}

export type Search = {
  value: string
  type: CategoryType
}

export enum VisualState {
  animatingIn = 'animating-in',
  showing = 'showing',
  animatingOut = 'animating-out',
  hidden = 'hidden'
}

export type ActiveItem = { item: MexitAction; active: boolean }

type SputlitContextType = {
  search: Search
  setSearch: (val: Search) => void
  selection: any
  setSelection: (val: any) => void
  searchResults: Array<MexitAction>
  setSearchResults: (val: Array<MexitAction>) => void
  activeIndex: number
  setActiveIndex: any
  setActiveItem: any
  activeItem: ActiveItem
  visualState: VisualState
  setVisualState: (vs: VisualState) => void
}

const SputlitContext = createContext<SputlitContextType>(undefined!)
export const useSputlitContext = () => useContext(SputlitContext)

export const SputlitProvider: React.FC = ({ children }: any) => {
  const [search, setSearch] = useState<Search>({ value: '', type: CategoryType.search })
  const [selection, setSelection] = useState<any>()
  const [searchResults, setSearchResults] = useState<Array<MexitAction>>([])
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [activeItem, setActiveItem] = useState<ActiveItem>({ item: undefined, active: false })
  const [visualState, setVisualState] = useState<VisualState>(VisualState.hidden)

  const value = {
    search,
    setSearch,
    selection,
    setSelection,
    activeIndex,
    setActiveIndex,
    activeItem,
    searchResults,
    setSearchResults,
    setActiveItem,
    visualState,
    setVisualState
  }

  return <SputlitContext.Provider value={value}>{children}</SputlitContext.Provider>
}
