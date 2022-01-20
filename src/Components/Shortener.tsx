import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { client } from '@workduck-io/dwindle'

import { useAuthStore } from '../Hooks/useAuth'
import { useShortenerStore } from '../Hooks/useShortener'
import { getCurrentTab } from '../Utils/tabInfo'
import { apiURLs } from '../routes'

interface ShortenFormDetails {
  short: string
  namespace?: string
}

const Shortener = () => {
  const [currTabURL, setCurrTabURL] = useState('')
  const [currTabID, setCurrTabID] = useState(-1)
  const [injected, setInjected] = useState(false)
  const [pageMetaTags, setPageMetaTags] = useState<any[]>([])
  const [shortenerResponse, setShortenerResponse] = useState<any>()
  const userDetails = useAuthStore((store) => store.userDetails)
  const workspaceDetails = useAuthStore((store) => store.workspaceDetails)

  const addLinkCapture = useShortenerStore((store) => store.addLinkCapture)

  const { handleSubmit, register } = useForm<ShortenFormDetails>({
    defaultValues: {
      short: '',
      namespace: 'WORKSPACE_1'
    }
  })

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

  const onShortenLinkSubmit = (data: ShortenFormDetails) => {
    const { short, namespace } = data

    chrome.tabs.sendMessage(
      currTabID,
      {
        method: 'GetPageMetaTags'
      },
      (response) => {
        setPageMetaTags(response.metaTags)
      }
    )
    const reqBody = {
      long: currTabURL,
      short: short,
      namespace: 'WORKSPACE_1', // Hardcoding right now
      metadata: {
        metaTags: pageMetaTags
      }
    }
    const URL = apiURLs.createShort

    client
      .post(URL, reqBody)
      .then((response: any) => {
        setShortenerResponse(response.data)
        addLinkCapture({
          ...reqBody,
          shortenedURL: response.data.message
        })
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.data.message === 'URL already exists') {
            setShortenerResponse({ message: 'Alias Already Exists, choose another' })
          } else {
            setShortenerResponse({ message: 'An Error Occured. Please try again' })
          }
        } else {
          setShortenerResponse({ message: 'An Error Occured. Please try again' })
        }
      })
  }

  return (
    <>
      <p>Shorten Your Link!</p>
      <p>Your current URL is: {currTabURL}</p>
      <form onSubmit={handleSubmit(onShortenLinkSubmit)}>
        <input placeholder="short alias you would like to give" {...register('short')} />
        <input placeholder="Workspace Name" readOnly={true} {...register('namespace')} />
        <input type="submit" />
      </form>
      <p>{JSON.stringify(shortenerResponse)}</p>
    </>
  )
}

export default Shortener
