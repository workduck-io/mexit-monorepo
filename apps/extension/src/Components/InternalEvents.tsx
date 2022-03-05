import React, { useEffect } from 'react'
import { useSputlitContext, VisualState } from '../Hooks/useSputlitContext'
import { getSelectionHTML } from '../Utils/getSelectionHTML'
import { sanitizeHTML } from '../Utils/sanitizeHTML'
import mixpanel from 'mixpanel-browser'
import * as Sentry from '@sentry/react'
import { CaptureConsole } from '@sentry/integrations'
import { initActions, parsePageMetaTags } from '@mexit/shared'
import Highlighter from 'web-highlighter'
import { useContentStore } from '../Hooks/useContentStore'
// import { getScrollbarWidth, shouldRejectKeystrokes, isModKey } from './utils'

type Timeout = ReturnType<typeof setTimeout>

export function InternalEvents() {
  useToggleHandler()
  initAnalytics()
  handleHighlighter()
  // useDocumentLock()
  // useShortcuts()
  // useFocusHandler()
  return null
}

const highlighter = new Highlighter()

/**
 * `useToggleHandler` handles the keyboard events for toggling kbar.
 */
function useToggleHandler() {
  const { visualState, setVisualState } = useSputlitContext()

  useEffect(() => {
    function messageHandler(request: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) {
      switch (request.type) {
        case 'sputlit':
          if (visualState === VisualState.hidden) {
            if (window.getSelection().toString() !== '') {
              const { url, html, range } = getSelectionHTML()

              const sanitizedHTML = sanitizeHTML(html)
            }

            setVisualState(VisualState.showing)
          } else {
            setVisualState(VisualState.hidden)
          }
        // The following shouldn't be here
        case 'GetPageMetaTags':
          const res = parsePageMetaTags()
          sendResponse({ metaTags: res })
          return true
      }
    }

    // Listen for message from background script to see if sputlit is requested
    chrome.runtime.onMessage.addListener(messageHandler)

    return () => chrome.runtime.onMessage.removeListener(messageHandler)
  }, [visualState])
}

function initAnalytics() {
  if (process.env.NX_MIXPANEL_TOKEN_EXTENSION) mixpanel.init(process.env.NX_MIXPANEL_TOKEN_EXTENSION, { debug: true })

  Sentry.init({
    dsn: 'https://0c6a334e733d44da96cfd64cc23b1c85@o1127358.ingest.sentry.io/6169172',
    integrations: [new CaptureConsole({ levels: ['error'] })]
  })
}

function handleHighlighter() {
  const contents = useContentStore().contents

  const highlightOldRange = (store: any) => {
    if (Object.keys(contents).length !== 0) {
      const highlights: any[] = contents[window.location.href]

      highlights.forEach((h) => {
        const { startMeta, endMeta, text, id } = h.range
        console.log(
          `Start Meta: ${JSON.stringify(startMeta)} | End Meta: ${JSON.stringify(endMeta)} | Text: ${text} | ID: ${id}`
        )
        highlighter.fromStore(startMeta, endMeta, text, id)
      })
    }
  }

  useEffect(() => {
    highlightOldRange(contents)
  })

  highlighter.on(Highlighter.event.CLICK, (e) => {
    const element = document.querySelector(`[data-highlight-id="${e.id}"]`)
    const coordinates = element.getBoundingClientRect()

    // TODO: change tooltip visual state
    // ReactDOM.createPortal(<Tooltip id={e.id} coordinates={coordinates} />, document.getElementById('tooltip-root'))
  })
}
