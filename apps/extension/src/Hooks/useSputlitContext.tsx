import React, { createContext, PropsWithChildren, useContext, useState } from 'react'

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
  isLoading: boolean
  setIsLoading: (val: boolean) => void
  activeIndex: number
  setActiveIndex: any
  visualState: VisualState
  setVisualState: (vs: VisualState) => void
  dibbaState: TooltipState
  setDibbaState: (vs: TooltipState) => void
}

const SputlitContext = createContext<SputlitContextType>(undefined!)
export const useSputlitContext = () => useContext(SputlitContext)

export const SputlitProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [visualState, setVisualState] = useState<VisualState>(VisualState.hidden)
  const [dibbaState, setDibbaState] = useState<TooltipState>({ visualState: VisualState.hidden })
  const [isLoading, setIsLoading] = useState(false)

  const value = {
    isLoading,
    setIsLoading,
    activeIndex,
    setActiveIndex,
    visualState,
    setVisualState,
    dibbaState,
    setDibbaState
  }

  return <SputlitContext.Provider value={value}>{children}</SputlitContext.Provider>
}
