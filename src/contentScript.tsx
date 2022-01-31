// Any kind of DOM manipulation is done here.
import React from 'react'
import ReactDOM from 'react-dom'
import Highlighter from 'web-highlighter'
import HighlightSource from 'web-highlighter/dist/model/source'
import * as Sentry from '@sentry/react'
import { CaptureConsole } from '@sentry/integrations'
import mixpanel from 'mixpanel-browser'

import Sputlit from './Components/Sputlit'
import { getDomMeta } from './Utils/highlight'
import { useContentStore } from './Hooks/useContentStore'
import { ThemeProvider } from 'styled-components'
import { theme } from './Styles/theme'
import { GlobalStyle } from './Styles/GlobalStyle'

if (process.env.REACT_APP_MIXPANEL_TOKEN) mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN, { debug: true })
Sentry.init({
  dsn: 'https://0c6a334e733d44da96cfd64cc23b1c85@o1127358.ingest.sentry.io/6169172',
  integrations: [new CaptureConsole({ levels: ['error'] })]
})

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

async function getSelectionHtml() {
  let html, url

  if (typeof window.getSelection != 'undefined') {
    const selection: Selection | null = window.getSelection()

    if (selection?.rangeCount) {
      url = selection?.anchorNode.baseURI

      const container = document.createElement('div')
      for (let i = 0, len = selection.rangeCount; i < len; ++i) {
        await container.appendChild(selection.getRangeAt(i).cloneContents())
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

const highlighter = new Highlighter()
const overlay = document.createElement('div')
overlay.id = 'extension-root'
document.body.appendChild(overlay)

function closeSputlit() {
  window.getSelection().removeAllRanges()
  ReactDOM.unmountComponentAtNode(overlay)
}

document.onkeyup = (e) => {
  if (e.key == 'Escape' && document.getElementById('extension-root')) {
    closeSputlit()
  }
}

// Listen for message from background script to see if sputlit is requested
chrome.runtime.onMessage.addListener(async (request) => {
  if (request.type === 'sputlit') {
    if (document.getElementById('sputlit-container') === null) {
      if (window.getSelection().toString() !== '') {
        const selection = window.getSelection()
        const range = selection.getRangeAt(0)

        highlighter.fromRange(range)
        const { url, html } = await getSelectionHtml()

        const saveableRange: Partial<HighlightSource> = {
          startMeta: getDomMeta(range.startContainer as Text, range.startOffset, document),
          endMeta: getDomMeta(range.endContainer as Text, range.endOffset, document),
          text: range.toString()
        }

        ReactDOM.render(
          <ThemeProvider theme={theme}>
            <GlobalStyle />
            <Sputlit url={url} html={html} range={saveableRange} />
          </ThemeProvider>,
          overlay
        )
      } else {
        ReactDOM.render(
          <ThemeProvider theme={theme}>
            <GlobalStyle />
            <Sputlit />
          </ThemeProvider>,
          overlay
        )
      }
    } else {
      closeSputlit()
    }
  }
})

// const highlightOldRange = (store: any) => {
//   if (Object.keys(store.contents).length !== 0) {
//     console.log('Highlight Content: ', store.contents)
//     const highlights: any[] = store.contents[window.location.href]
//     highlights.forEach((h) => {
//       const { startMeta, endMeta, text, id } = h.range
//       console.log(
//         `Start Meta: ${JSON.stringify(startMeta)} | End Meta: ${JSON.stringify(endMeta)} | Text: ${text} | ID: ${id}`
//       )
//       highlighter.fromStore(startMeta, endMeta, text, id)
//     })
//     unsub()
//   }
// }

// const unsub = useContentStore.subscribe((store: any) => store.contents, highlightOldRange)

export { closeSputlit }
