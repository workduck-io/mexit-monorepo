import { CategoryType, MexitAction, NodeContent } from '@mexit/core'
import React, { createContext, useContext, useState } from 'react'

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

export type VimiumState = {
  visualState: VisualState
  singleKeyPress?: string
  multiKeyPress?: string
  linksData?: {
    element: HTMLAllCollection
    lable: string
    possibleFalsePositive: boolean
    reason: null
    rect: {
      bottom: number
      top: number
      left: number
      right: number
      width: number
    }
    secondClassCitizen: boolean
  }[]
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
  input: string
  setInput: (val: string) => void
  isLoading: boolean
  setIsLoading: (val: boolean) => void
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
  vimium: VimiumState
  setVimium: (vs: VimiumState) => void
}

const SputlitContext = createContext<SputlitContextType>(undefined!)
export const useSputlitContext = () => useContext(SputlitContext)

export const SputlitProvider: React.FC = ({ children }: any) => {
  const [search, setSearch] = useState<Search>({ value: '', type: CategoryType.search })
  const [input, setInput] = useState('')
  const [selection, setSelection] = useState<any>()
  const [searchResults, setSearchResults] = useState<Array<MexitAction>>([])
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [activeItem, setActiveItem] = useState<MexitAction>()
  const [visualState, setVisualState] = useState<VisualState>(VisualState.hidden)
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    visualState: VisualState.hidden
  })
  const [dibbaState, setDibbaState] = useState<TooltipState>({ visualState: VisualState.hidden })
  const [isLoading, setIsLoading] = useState(false)
  const [vimium, setVimium] = useState<VimiumState>({ visualState: VisualState.showing })

  const value = {
    search,
    setSearch,
    input,
    setInput,
    isLoading,
    setIsLoading,
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
    vimium,
    setVimium
  }

  return <SputlitContext.Provider value={value}>{children}</SputlitContext.Provider>
}
