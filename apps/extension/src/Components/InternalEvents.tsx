import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { CaptureConsole } from '@sentry/integrations'
import * as Sentry from '@sentry/react'
import { forEach } from 'lodash'
import mixpanel from 'mixpanel-browser'
import { createRoot } from 'react-dom/client'
import Highlighter from 'web-highlighter'

import { MEXIT_FRONTEND_URL_BASE, mog } from '@mexit/core'
import { getScrollbarWidth } from '@mexit/shared'

import { useEditorStore } from '../Hooks/useEditorStore'
import { useHighlighter } from '../Hooks/useHighlighter'
import { useSaveChanges } from '../Hooks/useSaveChanges'
import { useSputlitContext, VisualState } from '../Hooks/useSputlitContext'
import { useHighlightStore, useHighlightStore2 } from '../Stores/useHighlightStore'
import { useSputlitStore } from '../Stores/useSputlitStore'
import { getDibbaText } from '../Utils/getDibbaText'
import { getSelectionHTML } from '../Utils/getSelectionHTML'
import { sanitizeHTML } from '../Utils/sanitizeHTML'
import LinkedInBadge from './LinkedInBadge'

export function InternalEvents() {
  useToggleHandler()
  initAnalytics()
  handleHighlighter()
  dibbaToggle()
  badgeRenderer()
  // useDocumentLock()
  // useFocusHandler()
  return null
}

type Timeout = ReturnType<typeof setTimeout>

/**
 * `useToggleHandler` handles the keyboard events for toggling sputlit.
 */
function useToggleHandler() {
  const { visualState, setVisualState } = useSputlitContext()
  const setSelection = useSputlitStore((s) => s.setSelection)
  const { previewMode, setPreviewMode } = useEditorStore()
  const setTooltipState = useSputlitStore((s) => s.setHighlightTooltipState)
  const resetSputlitState = useSputlitStore((s) => s.reset)

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
      const highlighter = new Highlighter({ style: { className: 'mexit-highlight' } })
      switch (request.type) {
        case 'sputlit':
          if (visualState === VisualState.hidden) {
            const selection = window.getSelection()
            if (selection?.toString() !== '') {
              const { url, html, range } = getSelectionHTML()
              const saveableRange = highlighter.fromRange(range)
              const sanitizedHTML = sanitizeHTML(html)

              setSelection({ url, html: sanitizedHTML, range: saveableRange, id: saveableRange?.id })
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
        setVisualState(VisualState.animatingOut)
        setTooltipState({ visualState: VisualState.hidden })
        resetSputlitState()
        setPreviewMode(true)
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
  const setTooltipState = useSputlitStore((s) => s.setHighlightTooltipState)
  const highlights = useHighlightStore2((s) => s.highlights)
  const getHighlightsOfUrl = useHighlightStore2((s) => s.getHighlightsOfUrl)
  const highlighedIds: string[] = []

  useEffect(() => {
    const highlighter = new Highlighter({ style: { className: 'mexit-highlight' } })
    const highlightOldRange = () => {
      const highlightsOfUrl = getHighlightsOfUrl(window.location.href)

      highlightsOfUrl.forEach((highlight) => {
        const { startMeta, endMeta, text, id } = highlight.properties.saveableRange
        mog('check', { id, highlighedIds })

        if (!highlighedIds.includes(id)) {
          highlighter.fromStore(startMeta, endMeta, text, highlight.entityId)
          highlighedIds.push(highlight.entityId)

          // if (highlight?.shared) {
          //   highlighter.addClass('shared', key)
          // }
        }
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
  }, [highlights])
}

function badgeRenderer() {
  function renderBadge() {
    const header = document.getElementsByClassName('pv-top-card__badge-wrap')[0]
    if (header && !document.getElementById('badge-root')) {
      const badgeContainer = document.createElement('div')
      badgeContainer.id = 'badge-root'

      header.prepend(badgeContainer)
      const badgeRoot = createRoot(badgeContainer)

      badgeRoot.render(<LinkedInBadge />)
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
