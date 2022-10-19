import React from 'react'

import { ThemeProvider } from 'styled-components'

import { defaultThemes, Notification } from '@mexit/shared'

import Dibba from './Components/Dibba'
import { DibbaPortal } from './Components/Dibba/DibbaPortal'
import { InternalEvents } from './Components/InternalEvents'
import ReminderArmer from './Components/ReminderArmer'
import { ExtInfoBar } from './Components/Sidebar'
import Sputlit from './Components/Sputlit'
import { SputlitPortal } from './Components/Sputlit/SputlitPortal'
import Tooltip from './Components/Tooltip'
import { TooltipPortal } from './Components/Tooltip/TooltipPortal'
import { EditorProvider } from './Hooks/useEditorContext'
import { HighlighterProvider } from './Hooks/useHighlighterContext'
import { SputlitProvider } from './Hooks/useSputlitContext'
import useThemeStore from './Hooks/useThemeStore'
import { GlobalStyle } from './Styles/GlobalStyle'

export default function Index() {
  const theme = useThemeStore((state) => state.theme)

  return (
    <ThemeProvider theme={theme?.themeData ?? defaultThemes[0].themeData}>
      <GlobalStyle />
      <ReminderArmer />
      <SputlitProvider>
        <HighlighterProvider>
          <DibbaPortal>
            <Dibba />
          </DibbaPortal>
          <Notification />

          <EditorProvider>
            <InternalEvents />

            {/* TODO: think of a better name, and use it everywhere for consistency */}
            <ExtInfoBar />

            <TooltipPortal>
              <Tooltip />
            </TooltipPortal>

            <SputlitPortal>
              <Sputlit />
            </SputlitPortal>
          </EditorProvider>
        </HighlighterProvider>
      </SputlitProvider>
    </ThemeProvider>
  )
}
