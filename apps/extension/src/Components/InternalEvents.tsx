import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { useSputlitContext, VisualState } from '../Hooks/useSputlitContext'
import { getSelectionHTML } from '../Utils/getSelectionHTML'
import { sanitizeHTML } from '../Utils/sanitizeHTML'
import mixpanel from 'mixpanel-browser'
import * as Sentry from '@sentry/react'
import { CaptureConsole } from '@sentry/integrations'
import { parsePageMetaTags } from '@mexit/shared'
import Highlighter from 'web-highlighter'
import { useContentStore } from '../Hooks/useContentStore'
import { getDibbaText } from '../Utils/getDibbaText'
import LinkedInBadge from './LinkedInBadge'
// import { getScrollbarWidth, shouldRejectKeystrokes, isModKey } from './utils'

export function InternalEvents() {
  useToggleHandler()
  initAnalytics()
  handleHighlighter()
  dibbaToggle()
  badgeRenderer()
  // useDocumentLock()
  // useShortcuts()
  // useFocusHandler()
  return null
}

const highlighter = new Highlighter()

/**
 * `useToggleHandler` handles the keyboard events for toggling sputlit.
 */
function useToggleHandler() {
  const { visualState, setVisualState, setSelection, setTooltipState } = useSputlitContext()

  useEffect(() => {
    function messageHandler(request: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) {
      switch (request.type) {
        case 'sputlit':
          if (visualState === VisualState.hidden) {
            if (window.getSelection().toString() !== '') {
              const { url, html, range } = getSelectionHTML()
              const saveableRange = highlighter.fromRange(range)
              const sanitizedHTML = sanitizeHTML(html)

              setSelection({ url: url, html: sanitizedHTML, range: saveableRange })
            } else {
              // To reset selection if a selection is made once
              setSelection(undefined)
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

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setVisualState(VisualState.hidden)
        setTooltipState({ visualState: VisualState.hidden })
      }
    }

    // Listen for message from background script to see if sputlit is requested
    chrome.runtime.onMessage.addListener(messageHandler)

    // Listen for keydown events
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      chrome.runtime.onMessage.removeListener(messageHandler)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [visualState])
}

function dibbaToggle() {
  const { dibbaState, setDibbaState } = useSputlitContext()

  useEffect(() => {
    function handleRender() {
      // @ts-ignore
      if (document.activeElement.isContentEditable) {
        const text = window.getSelection().anchorNode.textContent
        const range = window.getSelection().getRangeAt(0)
        const textAfterTrigger = getDibbaText(range, text)

        if (textAfterTrigger) {
          setDibbaState({
            visualState: VisualState.showing,
            coordinates: range.getClientRects()[0],
            extra: textAfterTrigger
          })
        } else {
          setDibbaState({ visualState: VisualState.hidden })
        }
      }
    }

    document.addEventListener('selectionchange', handleRender)

    return () => {
      document.removeEventListener('selectionchange', handleRender)
    }
  }, [dibbaState])
}

function initAnalytics() {
  if (process.env.NX_MIXPANEL_TOKEN_EXTENSION) mixpanel.init(process.env.NX_MIXPANEL_TOKEN_EXTENSION, { debug: true })

  Sentry.init({
    dsn: 'https://0c6a334e733d44da96cfd64cc23b1c85@o1127358.ingest.sentry.io/6169172',
    integrations: [new CaptureConsole({ levels: ['error'] })]
  })
}

function handleHighlighter() {
  const getContent = useContentStore((store) => store.getContent)
  const { setTooltipState } = useSputlitContext()

  const highlightOldRange = () => {
    const content = getContent(window.location.href)
    if (content && Object.keys(content).length !== 0) {
      content.forEach((h) => {
        const { startMeta, endMeta, text, id } = h.range
        highlighter.fromStore(startMeta, endMeta, text, id)
      })
    }
  }

  useEffect(() => {
    highlightOldRange()

    highlighter.on(Highlighter.event.CLICK, (e) => {
      const element = document.querySelector(`[data-highlight-id="${e.id}"]`)
      const coordinates = element.getBoundingClientRect()

      setTooltipState({ visualState: VisualState.showing, id: e.id, coordinates: coordinates })
    })

    return () => highlighter.dispose()
  }, [window.location.href])
}

function badgeRenderer() {
  function renderBadge() {
    const header = document.getElementsByClassName('pv-top-card__badge-wrap')[0]
    if (header && !document.getElementById('badge-root')) {
      const badgeRoot = document.createElement('div')
      badgeRoot.id = 'badge-root'

      header.prepend(badgeRoot)

      ReactDOM.render(<LinkedInBadge />, document.getElementById('badge-root'))
    }
  }

  useEffect(() => {
    // Only custom choosen urls have /in/
    // check comment on this answer https://stackoverflow.com/a/8450549/13011527
    if (window.location.host === 'www.linked.com') {
      chrome.runtime.sendMessage(
        {
          type: 'ASYNC_ACTION_HANDLER',
          subType: 'MEX_USER',
          data: {
            username: ''
          }
        },
        (response) => {
          const { message, error } = response

          // TODO: check message here
          if (message === '') {
            renderBadge()
          }
        }
      )
    }
  }, [])
}
