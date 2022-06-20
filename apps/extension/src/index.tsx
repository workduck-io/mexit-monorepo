import React from 'react'
import ReactDOM from 'react-dom'
import Sputlit from './Components/Sputlit'
import { ThemeProvider } from 'styled-components'
import { GlobalStyle } from './Styles/GlobalStyle'
import Tooltip from './Components/Tooltip'
import Chotu from './Components/Chotu'
import { SputlitProvider } from './Hooks/useSputlitContext'
import { SputlitPortal } from './Components/Sputlit/SputlitPortal'
import { InternalEvents } from './Components/InternalEvents'
import { TooltipPortal } from './Components/Tooltip/TooltipPortal'
import useThemeStore from './Hooks/useThemeStore'
import { defaultThemes } from '@mexit/shared'
import Dibba from './Components/Dibba'
import { DibbaPortal } from './Components/Dibba/DibbaPortal'
import { EditorProvider } from './Hooks/useEditorContext'
import ShortCutLinks from './Components/ShortCutLinks'
import ReminderArmer from './Components/ReminderArmer'
import ShortCutLinks from './Components/ShortCutLinks'

export default function Index() {
  const theme = useThemeStore((state) => state.theme)

  return (
    <ThemeProvider theme={theme?.themeData ?? defaultThemes[0].themeData}>
      <GlobalStyle />
      <ReminderArmer />
      <SputlitProvider>
        <DibbaPortal>
          <Dibba />
        </DibbaPortal>

        <EditorProvider>
          <InternalEvents />

          <Chotu />
          <ShortCutLinks/>

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
