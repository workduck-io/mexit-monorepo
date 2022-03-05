// Any kind of DOM manipulation is done here.
import React, { ReactNode, ReactPortal } from 'react'
import ReactDOM from 'react-dom'
import Highlighter from 'web-highlighter'
import HighlightSource from 'web-highlighter/dist/model/source'

import Sputlit from './Components/Sputlit'
import { getDomMeta } from './Utils/highlight'
import { useContentStore } from './Hooks/useContentStore'
import { ThemeProvider } from 'styled-components'
import { theme } from './Styles/theme'
import { GlobalStyle } from './Styles/GlobalStyle'
import Tooltip from './Components/Tooltip'
import Chotu from './Components/Chotu'
import { SputlitProvider, useSputlitContext, VisualState } from './Hooks/useSputlitContext'
import { SputlitPortal } from './Components/Sputlit/SputlitPortal'
import { InternalEvents } from './Components/InternalEvents'

const overlay = document.createElement('div')
overlay.id = 'extension-root'
document.body.appendChild(overlay)

// Add any providers here as they don't get unmounted with sputlit
ReactDOM.render(
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <SputlitProvider>
      <InternalEvents />
      <Chotu />
      <SputlitPortal>
        <Sputlit />
      </SputlitPortal>
    </SputlitProvider>
  </ThemeProvider>,
  overlay
)

document.onkeyup = (e) => {
  if (e.key == 'Escape' && document.getElementById('extension-root')) {
    // closeSputlit()
    ReactDOM.unmountComponentAtNode(document.getElementById('tooltip-root'))
  }
}
