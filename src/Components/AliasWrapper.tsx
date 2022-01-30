import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'
import { useActionsStore } from '../Hooks/useActions'
import { Tag } from '../Hooks/useTags'
import { checkMetaParseableURL, getCurrentTab } from '../Utils/tabInfo'
import Shortener from './Shortener'
import Tags from './Tags'

const Form = styled.form`
  display: flex;
  flex-direction: column;

  margin: 1rem;
`

const SubmitButton = styled.input`
  width: fit-content;
  background: #111827;
  color: #fff;
  border-radius: 0.25rem;
  border: none;
  padding: 0.5rem 1rem;
  line-height: 1.25rem;
  font-size: 0.9rem;

  cursor: pointer;
`

interface ShortenFormDetails {
  short: string
}

function AliasWrapper() {
  const [currTabURL, setCurrTabURL] = useState('')
  const [currTabID, setCurrTabID] = useState(-1)
  const [pageMetaTags, setPageMetaTags] = useState<any[]>()
  const [userTags, setUserTags] = useState<Tag[]>([])
  const [shortenerResponse, setShortenerResponse] = useState<any>()

  const actions = useActionsStore((store) => store.actions)
  const { handleSubmit, register } = useForm<ShortenFormDetails>()

  const onShortenLinkSubmit = (data: ShortenFormDetails) => {
    const { short } = data

    const reqBody = {
      long: currTabURL,
      short: short,
      metadata: {
        metaTags: pageMetaTags,
        userTags: userTags
      }
    }

    chrome.runtime.sendMessage(
      {
        type: 'DISPATCH_DWINDLE_REQUEST',
        subType: 'CREATE_SHORT_URL',
        data: {
          body: reqBody
        }
      },
      (response) => {
        const { message, error } = response
        if (error) {
          if (error === 'Not Authenticated') {
            setShortenerResponse({ message: 'Not Authenticated. Please login via Popup' })
          } else if (error.data.message === 'URL already exists') {
            setShortenerResponse({ message: 'Alias Already Exists, choose another' })
          } else {
            setShortenerResponse({ message: 'An Error Occured. Please try again' })
          }
        } else {
          setShortenerResponse(message)
        }
      }
    )
  }

  /* Fetch Current Tab Information using chrome APIs */
  useEffect(() => {
    async function fetchTab() {
      const currentTab = await getCurrentTab()
      setCurrTabURL(currentTab.url)
      setCurrTabID(currentTab.id)
    }
    fetchTab()
  }, [])

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

  // TODO: a provider for this too, or even better if we can let go of passing props. Why not let the components contain the logic
  return (
    <Form onSubmit={handleSubmit(onShortenLinkSubmit)}>
      <Shortener currTabURL={currTabURL} register={register} />
      <Tags addNewTag={addNewUserTag} removeTag={removeUserTag} userTags={userTags} />
      <SubmitButton type="submit" value="Save" />
      <p>{JSON.stringify(shortenerResponse)}</p>
    </Form>
  )
}

export default AliasWrapper
