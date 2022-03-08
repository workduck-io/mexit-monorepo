import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'
import { toast, Toaster } from 'react-hot-toast'

import { apiURLs, Button, useTagStore } from '@mexit/shared'
import { Tag } from '@mexit/shared'
import { checkMetaParseableURL, parsePageMetaTags } from '@mexit/shared'
import { Shortener } from './Shortener'
import { Tags } from './Tags'
import { useShortenerStore } from '../../Stores/useShortener'
import { useAuthStore } from '../../Stores/useAuth'
import { client } from '@workduck-io/dwindle'
import { resize } from '../../Utils/helper'

const Form = styled.form`
  display: flex;
  flex-direction: column;

  margin: 1rem;
`

export interface ShortenFormDetails {
  short: string
}

export const AliasWrapper = () => {
  const [currTabURL, setCurrTabURL] = useState(document.referrer)
  const [pageMetaTags, setPageMetaTags] = useState<any[]>()
  const [userTags, setUserTags] = useState<Tag[]>([])
  const [shortenerResponse, setShortenerResponse] = useState<any>()
  const elementRef = useRef(null)

  const addLinkCapture = useShortenerStore((store) => store.addLinkCapture)
  const addTagsToGlobalStore = useTagStore((store) => store.addTags)
  const { handleSubmit, register } = useForm<ShortenFormDetails>()
  const workspaceDetails = useAuthStore((store) => store.workspaceDetails)
  const userDetails = useAuthStore((store) => store.userDetails)

  const onShortenLinkSubmit = async (data: ShortenFormDetails) => {
    const { short } = data

    const reqBody = {
      long: currTabURL,
      short: short,
      metadata: {
        metaTags: pageMetaTags,
        userTags: userTags
      },
      namespace: workspaceDetails.name
    }

    addTagsToGlobalStore(reqBody.metadata.userTags)

    const URL = apiURLs.createShort
    let response: any
    try {
      response = await client.post(URL, reqBody, {
        headers: {
          'workspace-id': workspaceDetails.id
        }
      })
    } catch (error) {
      response = error
    }

    window.parent.postMessage(
      {
        type: 'shortener',
        status: response.status,
        message: response.message || { ...reqBody, shortenedURL: response.data.shortenedURL }
      },
      '*'
    )
  }
  useEffect(() => {}, [])

  const handleEvent = (event: MessageEvent) => {
    switch (event.data.type) {
      case 'tab-info-response':
        setCurrTabURL(event.data.data.url)
    }
  }

  useEffect(() => {
    window.addEventListener('message', handleEvent)

    window.parent.postMessage(
      {
        type: 'tab-info-request'
      },
      '*'
    )

    return () => {
      window.removeEventListener('message', handleEvent)
    }
  }, [])

  useEffect(() => {
    if (elementRef !== null) {
      resize(elementRef)
    }
  }, [elementRef])

  useEffect(() => {
    if (checkMetaParseableURL(currTabURL)) {
      const mt = parsePageMetaTags()
      setPageMetaTags(mt)
    }
  }, [])

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
    <Form ref={elementRef} onSubmit={handleSubmit(onShortenLinkSubmit)}>
      <Shortener currTabURL={currTabURL} register={register} setCurrTabURL={setCurrTabURL} />
      <Tags addNewTag={addNewUserTag} removeTag={removeUserTag} userTags={userTags} />
      <Button type="submit" value="Save" />
    </Form>
  )
}
