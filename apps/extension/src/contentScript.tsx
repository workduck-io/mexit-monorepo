// Any kind of DOM manipulation is done here.
import React from 'react'
import ReactDOM from 'react-dom'
import { StyleSheetManager } from 'styled-components'

import Index from '.'

const shadowRoot = document.createElement('div')
shadowRoot.id = 'mexit'
shadowRoot.style.cssText = 'all: initial'
document.documentElement.appendChild(shadowRoot)

export const styleSlot = document.createElement('div')
styleSlot.id = 'style-sheet-target'
shadowRoot.attachShadow({ mode: 'closed' }).appendChild(styleSlot)

const root = document.createElement('div')
root.id = 'chotu-container'

styleSlot.appendChild(root)

ReactDOM.render(
  <StyleSheetManager target={styleSlot}>
    <Index />
  </StyleSheetManager>,
  root
)
