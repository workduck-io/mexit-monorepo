// Any kind of DOM manipulation is done here.
import React from 'react'
import ReactDOM from 'react-dom'
import { StyleSheetManager } from 'styled-components'
import tinykeys from 'tinykeys'

import Index from '.'

const shadowRoot = document.createElement('div')
shadowRoot.id = 'mexit'
shadowRoot.style.cssText = 'all: initial'
document.documentElement.appendChild(shadowRoot)

export const styleSlot = document.createElement('div')
styleSlot.id = 'style-sheet-target'
shadowRoot.attachShadow({ mode: 'closed' }).appendChild(styleSlot)

// Adding a stopPropagation here so as to not notify any event listeners on the window
// Checkout: https://github.com/facebook/react/issues/11387#issuecomment-355258340
// And this too: https://github.com/facebook/react/issues/24136
// event propagation is stopped for all keydown events except the ones required for opening/closing sputlit
shadowRoot.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') {
    event.stopPropagation()
  }
})

const root = document.createElement('div')
root.id = 'chotu-container'

styleSlot.appendChild(root)

ReactDOM.render(
  <StyleSheetManager target={styleSlot}>
    <Index />
  </StyleSheetManager>,
  root
)
