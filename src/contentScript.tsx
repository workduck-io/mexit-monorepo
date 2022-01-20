// Any kind of DOM manipulation is done here.
import { nanoid } from 'nanoid'
import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { ThemeProvider } from 'styled-components'
import { GlobalStyle } from './Styles/GlobalStyle'
import { theme } from './Styles/theme'
import Sputlit from './Components/Sputlit'

// TODO(@sahil-shubham): remove console logs;
// const delta = 6;
// let startX: number;
// let startY: number;

// document.addEventListener("mousedown", function (event) {
//   startX = event.pageX;
//   startY = event.pageY;
// });

// document.addEventListener("mouseup", function (event) {
//   const diffX = Math.abs(event.pageX - startX);
//   const diffY = Math.abs(event.pageY - startY);

//   // Checking if the mouse moved between mouseup and mousedown
//   // or if a selection is present without dragging (e.g clicking on a paragraph multiple times)
//   if (diffX > delta && diffY > delta) {
//     getSelectionHtml();
//   } else if (window.getSelection()?.type != "Caret") {
//     getSelectionHtml();
//   }
// });

function getSelectionHtml() {
  let html = ''
  let url = ''

  if (typeof window.getSelection != 'undefined') {
    const selection: Selection | null = window.getSelection()

    if (selection?.rangeCount) {
      url = selection?.anchorNode.baseURI

      const container = document.createElement('div')
      for (let i = 0, len = selection.rangeCount; i < len; ++i) {
        container.appendChild(selection.getRangeAt(i).cloneContents())
      }
      html = container.innerHTML
    }
  }

  return { url, html }
}

const parsePageMetaTags = () => {
  const metaElements = document.getElementsByTagName('meta')
  const title = document.getElementsByTagName('title')[0]

  const res = []

  for (let i = 0; i < metaElements.length; i++) {
    const name = metaElements[i].getAttribute('name')
    const property = metaElements[i].getAttribute('property')
    const content = metaElements[i].getAttribute('content')

    const tName = name ? name : property
    if (content !== null && tName !== null) {
      res.push({
        name: tName,
        value: content
      })
    }
  }

  res.push({
    name: 'title',
    value: title.innerText
  })
  return res
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.method === 'GetPageMetaTags') {
    const res = parsePageMetaTags()
    sendResponse({ metaTags: res })
    return true
  }
})

// Listen for message from background script to see if sputlit is requested

chrome.runtime.onMessage.addListener((request) => {
  if (request.type === 'sputlit') {
    if (document.getElementById('extension-root') === null) {
      const overlay = document.createElement('div')
      overlay.id = 'extension-root'
      document.body.appendChild(overlay)

      const { url, html } = getSelectionHtml()
      const nodeId = nanoid()

      ReactDOM.render(
        <React.StrictMode>
          <Sputlit url={url} html={html} nodeId={nodeId} />
        </React.StrictMode>,
        overlay
      )
    } else {
      //TODO: Add separate listeners to close sputlit on keys like escape
      document.getElementById('extension-root')?.remove()
    }
  }
})

export {}
