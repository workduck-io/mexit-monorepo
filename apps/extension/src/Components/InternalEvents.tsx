import React, { useCallback, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { useSputlitContext, VisualState } from '../Hooks/useSputlitContext'
import { getSelectionHTML } from '../Utils/getSelectionHTML'
import { sanitizeHTML } from '../Utils/sanitizeHTML'
import mixpanel from 'mixpanel-browser'
import * as Sentry from '@sentry/react'
import { CaptureConsole } from '@sentry/integrations'
import { getScrollbarWidth, parsePageMetaTags, useIntervalWithTimeout, useTimout } from '@mexit/shared'
import Highlighter from 'web-highlighter'
import { getDibbaText } from '../Utils/getDibbaText'
import LinkedInBadge from './LinkedInBadge'
import { getHtmlString } from './Source'
import { MEXIT_FRONTEND_URL_BASE, mog } from '@mexit/core'
import { useContentStore } from '../Stores/useContentStore'
import { useEditorContext } from '../Hooks/useEditorContext'
import { useSaveChanges } from '../Hooks/useSaveChanges'
import { useHighlightStore } from '../Stores/useHighlightStore'
import { forEach } from 'lodash'

export function InternalEvents() {
  useToggleHandler()
  initAnalytics()
  handleHighlighter()
  dibbaToggle()
  badgeRenderer()
  useDocumentLock()
  // useFocusHandler()
  return null
}

type Timeout = ReturnType<typeof setTimeout>

/**
 * `useToggleHandler` handles the keyboard events for toggling sputlit.
 */
function useToggleHandler() {
  const { visualState, setVisualState, setSelection, setTooltipState } = useSputlitContext()
  const { previewMode, setPreviewMode } = useEditorContext()
  const { saveIt } = useSaveChanges()

  const timeoutRef = useRef<Timeout>()
  const runAnimateTimer = useCallback((vs: VisualState.animatingIn | VisualState.animatingOut) => {
    let ms = 0
    if (vs === VisualState.animatingIn) {
      ms = 200
    }
    if (vs === VisualState.animatingOut) {
      ms = 100
    }

    clearTimeout(timeoutRef.current as Timeout)
    timeoutRef.current = setTimeout(() => {
      if (vs === VisualState.animatingIn) {
        setVisualState(VisualState.showing)
      } else if (vs === VisualState.animatingOut) {
        setVisualState(VisualState.hidden)
      }
    }, ms)
  }, [])

  useEffect(() => {
    function messageHandler(request: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) {
      const highlighter = new Highlighter()

      switch (request.type) {
        case 'sputlit':
          if (visualState === VisualState.hidden) {
            if (window.getSelection().toString() !== '') {
              const { url, html, range } = getSelectionHTML()
              const saveableRange = highlighter.fromRange(range)
              const sanitizedHTML = sanitizeHTML(html) + getHtmlString(window.location.href)

              setSelection({ url: url, html: sanitizedHTML, range: saveableRange })
            } else {
              // To reset selection if a selection is made once
              setSelection(undefined)
            }

            setVisualState(VisualState.animatingIn)
          } else {
            setVisualState(VisualState.animatingOut)
          }
          sendResponse(true)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (previewMode) {
          setVisualState(VisualState.animatingOut)
          setTooltipState({ visualState: VisualState.hidden })
        } else {
          setPreviewMode(true)
          saveIt(false, true)
        }
      }
    }

    switch (visualState) {
      case VisualState.animatingIn:
      case VisualState.animatingOut:
        runAnimateTimer(visualState)
        break
    }

    // Listen for message from background script to see if sputlit is requested
    chrome.runtime.onMessage.addListener(messageHandler)

    // Listen for keydown events
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      chrome.runtime.onMessage.removeListener(messageHandler)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [visualState, previewMode])
}

function dibbaToggle() {
  const { dibbaState, setDibbaState } = useSputlitContext()

  // TODO: store this in preferences, whenever that is made
  const disabledWebsites = [MEXIT_FRONTEND_URL_BASE]

  useEffect(() => {
    function handleRender() {
      // eslint-disable-next-line
      // @ts-ignore
      if (document.activeElement.isContentEditable && !disabledWebsites.includes(window.location.origin)) {
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
  const { setTooltipState } = useSputlitContext()
  const { highlighted } = useHighlightStore()

  useEffect(() => {
    const highlighter = new Highlighter()
    const highlightOldRange = () => {
      const highlighted = useHighlightStore.getState().highlighted
      const pageContents = highlighted[window.location.href]

      forEach(pageContents, (value, key) => {
        const { startMeta, endMeta, text, id } = value.elementMetadata.saveableRange
        highlighter.fromStore(startMeta, endMeta, text, key)
      })
    }

    highlightOldRange()

    highlighter.on(Highlighter.event.CLICK, (e) => {
      const element = document.querySelector(`[data-highlight-id="${e.id}"]`)
      const coordinates = element.getBoundingClientRect()

      setTooltipState({ visualState: VisualState.showing, id: e.id, coordinates: coordinates })
    })

    return () => highlighter.dispose()
    // I want to replace the keys generated by web-highlighter, and re-highlight everything with blockId as their respective id
  }, [highlighted])
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
    const url = window.location.href
    const LINKEDIN_REGEX = /^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\/(pub|in|profile)/

    if (url.match(LINKEDIN_REGEX)) {
      chrome.runtime.sendMessage(
        {
          type: 'ASYNC_ACTION_HANDLER',
          subType: 'MEX_USER',
          data: {
            body: {
              linkedinURL: url
            }
          }
        },
        (response) => {
          const { message, error } = response

          if (message && message.data.mex_user) {
            console.log('Showing Linkedin Badge', message)
            renderBadge()
          }

          // TODO: check message here
          // if (message === '') {
          // }
        }
      )
    }
  }, [])
}

/**
 * `useDocumentLock` is a simple implementation for preventing the
 * underlying page content from scrolling when kbar is open.
 */
function useDocumentLock() {
  const { visualState } = useSputlitContext()

  useEffect(() => {
    if (visualState === VisualState.showing) {
      // adding style to html instead of body because it worked in all sites
      document.documentElement.style.overflow = 'hidden'

      let scrollbarWidth = getScrollbarWidth()
      // take into account the margins explicitly added by the consumer
      const mr = getComputedStyle(document.documentElement)['margin-right']
      if (mr) {
        // remove non-numeric values; px, rem, em, etc.
        scrollbarWidth += Number(mr.replace(/\D/g, ''))
      }
      document.documentElement.style.marginRight = scrollbarWidth + 'px'
    } else if (visualState === VisualState.hidden) {
      document.documentElement.style.removeProperty('overflow')

      document.documentElement.style.removeProperty('margin-right')
    }
  }, [visualState])
}
