import { defaultThemes, Notification } from '@mexit/shared'
import React, { useMemo } from 'react'
import { ThemeProvider } from 'styled-components'

import Dibba from './Components/Dibba'
import { DibbaPortal } from './Components/Dibba/DibbaPortal'
import { InternalEvents } from './Components/InternalEvents'
import ReminderArmer from './Components/ReminderArmer'
import { ExtInfoBar } from './Components/Sidebar'
import Sputlit from './Components/Sputlit'
import { SputlitPortal } from './Components/Sputlit/SputlitPortal'
import Tooltip from './Components/Tooltip'
import { TooltipPortal } from './Components/Tooltip/TooltipPortal'
import { HighlighterProvider } from './Hooks/useHighlighterContext'
import { SputlitProvider } from './Hooks/useSputlitContext'
import { useUserPreferenceStore } from './Stores/userPreferenceStore'
import { GlobalStyle } from './Styles/GlobalStyle'

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useUserPreferenceStore((state) => state.theme)

  const themeData = useMemo(() => {
    const ctheme = defaultThemes.find((t) => t.id === theme)
    return ctheme ? ctheme.themeData : defaultThemes[0].themeData
  }, [theme])

  return <ThemeProvider theme={themeData}>{children}</ThemeProvider>
}

export default function Index() {
  return (
    <Providers>
      <GlobalStyle />
      <ReminderArmer />
      <SputlitProvider>
        <HighlighterProvider>
          <DibbaPortal>
            <Dibba />
          </DibbaPortal>
          <Notification />

          <InternalEvents />

          {/* TODO: think of a better name, and use it everywhere for consistency */}
          <ExtInfoBar />

          <TooltipPortal>
            <Tooltip />
          </TooltipPortal>

          <SputlitPortal>
            <Sputlit />
          </SputlitPortal>
        </HighlighterProvider>
      </SputlitProvider>
    </Providers>
  )
}
