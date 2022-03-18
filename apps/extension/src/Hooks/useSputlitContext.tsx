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

export type TooltipState = {
  visualState: VisualState
  id?: string
  coordinates?: DOMRect
  extra?: {
    range: Range
    textAfterTrigger: string
  }
}

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
  activeItem: MexitAction
  visualState: VisualState
  setVisualState: (vs: VisualState) => void
  tooltipState: TooltipState
  setTooltipState: (vs: TooltipState) => void
  dibbaState: TooltipState
  setDibbaState: (vs: TooltipState) => void
  preview: boolean
  setPreview: (val: boolean) => void
}

const SputlitContext = createContext<SputlitContextType>(undefined!)
export const useSputlitContext = () => useContext(SputlitContext)

export const SputlitProvider: React.FC = ({ children }: any) => {
  const [search, setSearch] = useState<Search>({ value: '', type: CategoryType.search })
  const [selection, setSelection] = useState<any>()
  const [searchResults, setSearchResults] = useState<Array<MexitAction>>([])
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [activeItem, setActiveItem] = useState<MexitAction>()
  const [visualState, setVisualState] = useState<VisualState>(VisualState.hidden)
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    visualState: VisualState.hidden
  })
  const [dibbaState, setDibbaState] = useState<TooltipState>({ visualState: VisualState.hidden })
  const [preview, setPreview] = useState(true)

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
    setVisualState,
    tooltipState,
    setTooltipState,
    dibbaState,
    setDibbaState,
    preview,
    setPreview
  }

  return <SputlitContext.Provider value={value}>{children}</SputlitContext.Provider>
}
