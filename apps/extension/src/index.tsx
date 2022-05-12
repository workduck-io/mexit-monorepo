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

export default function Index() {
  const theme = useThemeStore((state) => state.theme)

  return (
    <ThemeProvider theme={theme?.themeData ?? defaultThemes[0].themeData}>
      <GlobalStyle />
      <SputlitProvider>
        <InternalEvents />

        <Chotu />

        <DibbaPortal>
          <Dibba />
        </DibbaPortal>

        <EditorProvider>
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
