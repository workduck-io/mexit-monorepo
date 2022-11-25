import React, { createContext, PropsWithChildren, useContext, useEffect, useRef } from 'react'

import Highlighter from 'web-highlighter'

type HighlighterContextType = {
  highlighter: Highlighter
}

const HighlighterContext = createContext<HighlighterContextType>(undefined)
export const useHighlighterContext = () => useContext(HighlighterContext)

export const HighlighterProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const highlighter = useRef(new Highlighter({ style: { className: 'mexit-highlight' } }))

  useEffect(() => {
    return () => {
      if (highlighter.current) {
        highlighter.current?.dispose()
      }
    }
  }, [])

  const value = {
    highlighter: highlighter.current
  }

  return <HighlighterContext.Provider value={value}>{children}</HighlighterContext.Provider>
}
