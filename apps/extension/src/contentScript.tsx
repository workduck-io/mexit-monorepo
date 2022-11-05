// Any kind of DOM manipulation is done here.
import React from 'react'

import '@webcomponents/custom-elements'
import { createRoot } from 'react-dom/client'
import { StyleSheetManager } from 'styled-components'

import Index from '.'

const shadowRoot = document.createElement('div')
shadowRoot.id = 'mexit'
shadowRoot.style.cssText = 'all: initial'
document.documentElement.appendChild(shadowRoot)

export const styleSlot = document.createElement('div')
styleSlot.id = 'style-sheet-target'

// keeping the shadow dom open so that extensions or websites can see the actual
// target of the event, closed shadow dom results in shadow root being the
// target of all events
shadowRoot.attachShadow({ mode: 'open' }).appendChild(styleSlot)

// Adding a stopPropagation here so as to not notify any event listeners on the window
// Checkout: https://github.com/facebook/react/issues/11387#issuecomment-355258340
// And this too: https://github.com/facebook/react/issues/24136
// event propagation is stopped for all keydown events except the ones required for opening/closing sputlit
shadowRoot.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' && !(event.metaKey && event.code === 'Slash')) {
    event.stopPropagation()
  }
})

export const getElementById = (id: string) => {
  return document.getElementById('mexit').shadowRoot.getElementById(id)
}

// Adding another container inside styleSlot because it isn't able to handle multiple children if they are rendered at init
// Why? I don't know. Will create a minimal reproducible example and test, will report to styled-components if an actual issue.
const container = document.createElement('div')
container.id = 'mexit-container'
styleSlot.appendChild(container)

const root = createRoot(container)

root.render(
  <StyleSheetManager target={styleSlot}>
    <Index />
  </StyleSheetManager>
)
