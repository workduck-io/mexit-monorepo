import React from 'react'

import { ThemeProvider } from 'styled-components'

import { defaultThemes } from '@mexit/shared'

import Dibba from './Components/Dibba'
import { DibbaPortal } from './Components/Dibba/DibbaPortal'
import { InternalEvents } from './Components/InternalEvents'
import ReminderArmer from './Components/ReminderArmer'
import Sputlit from './Components/Sputlit'
import { SputlitPortal } from './Components/Sputlit/SputlitPortal'
import Tooltip from './Components/Tooltip'
import { TooltipPortal } from './Components/Tooltip/TooltipPortal'
import { EditorProvider } from './Hooks/useEditorContext'
import { SputlitProvider } from './Hooks/useSputlitContext'
import useThemeStore from './Hooks/useThemeStore'
import { GlobalStyle } from './Styles/GlobalStyle'

export default function Index() {
  const theme = useThemeStore((state) => state.theme)

  return (
    <ThemeProvider theme={theme?.themeData ?? defaultThemes[0].themeData}>
      <GlobalStyle />
      {/* TODO: runnign into an error 'Cannot read properties of undefined (reading filter) useReminders.ts 155 */}
      {/* <ReminderArmer /> */}
      <SputlitProvider>
        <DibbaPortal>
          <Dibba />
        </DibbaPortal>

        <EditorProvider>
          <InternalEvents />

          <TooltipPortal>
            <Tooltip />
          </TooltipPortal>

          <SputlitPortal>
            <Sputlit />
          </SputlitPortal>
        </EditorProvider>
      </SputlitProvider>
    </ThemeProvider>
  )
}
