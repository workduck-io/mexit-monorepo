import React, { useState, useEffect } from 'react'

import { getCurrentTab, checkMetaParseableURL } from '../Utils/tabInfo'
import Shortener from './Shortener'
import Tags from './Tags'
import { Tag } from '../Types/Tags'

const BaseView = () => {
  const [currTabURL, setCurrTabURL] = useState('')
  const [currTabID, setCurrTabID] = useState(-1)
  const [injected, setInjected] = useState(false)
  const [pageMetaTags, setPageMetaTags] = useState<any[]>()
  const [userTags, setUserTags] = useState<Tag[]>([])

  /* Fetch Current Tab Information using chrome APIs */
  useEffect(() => {
    async function fetchTab() {
      const currentTab = await getCurrentTab()
      setCurrTabURL(currentTab.url)
      setCurrTabID(currentTab.id)
    }
    fetchTab()
  }, [])

  /* Inject Content Script into current tab */
  useEffect(() => {
    async function injectScript() {
      if (currTabID !== -1 && !injected) {
        await chrome.scripting.executeScript({
          target: {
            tabId: currTabID
          },
          files: ['./static/js/content.js']
        })
      }
    }
    injectScript()
    setInjected(true)
  }, [currTabID, injected])

  /* Try to fetch page metadata using content script*/
  useEffect(() => {
    if (currTabID > 0 && checkMetaParseableURL(currTabURL)) {
      chrome.tabs.sendMessage(
        currTabID,
        {
          method: 'GetPageMetaTags'
        },
        (response) => {
          if (!chrome.runtime.lastError) {
            const mt = response.metaTags
            setPageMetaTags(mt)
          }
        }
      )
    }
  }, [currTabID, currTabURL])

  const addNewUserTag = (tag: Tag) => {
    setUserTags([...userTags, tag])
  }

  const removeUserTag = (tag: Tag) => {
    const t = userTags
    const idx = t.map((e) => e.id).indexOf(tag.id)
    t.splice(idx, 1)
    setUserTags([...t])
  }

  return (
    <>
      <Shortener currTabURL={currTabURL} pageMetaTags={pageMetaTags} userTags={userTags} />
      <Tags addNewTag={addNewUserTag} removeTag={removeUserTag} userTags={userTags} />
    </>
  )
}

export default BaseView
