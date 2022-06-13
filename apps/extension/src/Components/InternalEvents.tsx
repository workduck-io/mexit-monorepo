import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { useSputlitContext, VisualState } from '../Hooks/useSputlitContext'
import { getSelectionHTML } from '../Utils/getSelectionHTML'
import { sanitizeHTML } from '../Utils/sanitizeHTML'
import mixpanel from 'mixpanel-browser'
import * as Sentry from '@sentry/react'
import { CaptureConsole } from '@sentry/integrations'
import { getScrollbarWidth, parsePageMetaTags } from '@mexit/shared'
import Highlighter from 'web-highlighter'
import { useContentStore } from '@workduck-io/mex-editor'
import { getDibbaText } from '../Utils/getDibbaText'
import LinkedInBadge from './LinkedInBadge'
import { getHtmlString } from './Source'
import { MEXIT_FRONTEND_URL_BASE } from '@mexit/core'
import { incrementChar } from '../Utils/incrementChar'
import { Interface } from 'readline'
import tinykeys from 'tinykeys'
import { cond } from 'lodash'

export function InternalEvents() {
  useToggleHandler()
  initAnalytics()
  handleHighlighter()
  dibbaToggle()
  badgeRenderer()
  useDocumentLock()
  useVimium()
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
              const sanitizedHTML = sanitizeHTML(html) + getHtmlString(window.location.href)

              setSelection({ url: url, html: sanitizedHTML, range: saveableRange })
            } else {
              // To reset selection if a selection is made once
              setSelection(undefined)
            }

            setVisualState(VisualState.showing)
          } else {
            setVisualState(VisualState.hidden)
          }
          sendResponse(true)
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
  const getContentFromLink = useContentStore((store) => store.getContentFromLink)
  const { setTooltipState } = useSputlitContext()

  const highlightOldRange = () => {
    const pageContents = getContentFromLink(window.location.href)
    console.log('content', pageContents)
    // TODO: fix the following for multiple highlights on a page, maybe storing multiple highlights as a block in a node?
    pageContents.forEach((item) => {
      if (item?.metadata?.sourceUrl === window.location.href && item?.metadata?.saveableRange) {
        const { startMeta, endMeta, text, id } = item.metadata.saveableRange
        highlighter.fromStore(startMeta, endMeta, text, id)
      }
    })
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

function useVimium() {
  const { visualState } = useSputlitContext()
  const [toggleVimium, setToggleVimium] = React.useState<boolean>(true);
  let keyString = {};
  function doFunction(string: String) {
    if (string === "k") {
      window.scrollTo(window.pageXOffset, window.pageYOffset - 100);
    }
    else if (string === "j") {
      window.scrollTo(window.pageXOffset, window.pageYOffset + 100);
    }
    else if (string === "h") {
      window.scrollTo(window.pageXOffset - 100, window.pageYOffset);
    }
    else if (string === "l") {
      window.scrollTo(window.pageXOffset + 100, window.pageYOffset);
    }
    else if (string === "d") {
      window.scrollTo(window.pageXOffset, window.pageYOffset + window.innerHeight / 2);
    }
    else if (string === "u") {
      window.scrollTo(window.pageXOffset, window.pageYOffset - window.innerHeight / 2);
    }
    else if (string === "gg") {
      window.scrollTo(window.pageXOffset, 0);
    }
    else if (string === "G") {
      window.scrollTo(window.pageXOffset, document.body.scrollHeight);
    }
    else if (string === "r") {
      location.reload();
    }
    else if (string === "i") {
      setToggleVimium(false);
    }
    else if (string === "yy") {
      console.log("Manav")
      chrome.runtime.sendMessage(
        {
          type: 'ASYNC_ACTION_HANDLER',
          subType: 'GET_CURRENT_TAB'
        },
        (response) => {
          const Url = response.message[0].url;
          navigator.clipboard.writeText(Url);
        }
      )
    }
    else if (string === "gs") {
      chrome.runtime.sendMessage(
        {
          type: 'ASYNC_ACTION_HANDLER',
          subType: 'GET_CURRENT_TAB'
        },
        (response) => {
          const newUrl = "view-source:" + response.message[0].url;
          chrome.runtime.sendMessage(
            {
              type: 'ASYNC_ACTION_HANDLER',
              subType: 'OPEN_WITH_NEW_TABS',
              data: {
                urls: newUrl
              }
            },
            (response) => {
              const { message, error } = response
              if (error) console.error('Some error occured. Please Try Again')
            }
          )
        }
      )
    }
  }
  function checkTyping(event) {
    if (event.target.nodeName === "INPUT") {
      setToggleVimium(false);
    } else {
      setToggleVimium(true);
    }
  }
  useEffect(() => {
    window.addEventListener("click", checkTyping)
  })
  function checkVal() {
    // console.log(keyString);
    let stringPress = '';
    for (const key in keyString) {
      if (key !== 'Alt') {
        if (key !== 'Shift') {
          if (key !== 'CapsLock') {
            if (key !== 'Ctrl') {
              // stringPress += key;
              for(let i = 0 ; i < keyString[key] ; i++){
                stringPress += key;
              }
            }
          }
        }
      }
    }
    doFunction(stringPress);
  }
  const keydown = (e) => {
    if (e.key === "escape" || visualState === VisualState.showing) {
      setToggleVimium(true);
    }
    if (toggleVimium) {
      if(keyString[e.key]){
        keyString[e.key]++;
      }else{
        keyString[e.key] = 1;
      };
      setTimeout(() => checkVal(), 1000);
    }
  }
  const keyup = (e) => {
    if (e.key === "escape" || visualState === VisualState.showing) {
      setToggleVimium(true);
    }
    if (toggleVimium) {
      setTimeout(() => delete keyString[e.key], 1000);
    }
  }
  useEffect(() => {
    window.addEventListener("keydown", (e) => keydown(e))
    window.addEventListener("keyup", (e) => keyup(e))
    return () => {
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
    }
  })
}