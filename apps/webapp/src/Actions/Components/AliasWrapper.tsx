import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'
import { toast, Toaster } from 'react-hot-toast'

import { apiURLs, Button } from '@mexit/shared'
import { Tag } from '@mexit/shared'
import { checkMetaParseableURL, parsePageMetaTags } from '@mexit/shared'
import { Shortener } from './Shortener'
import { Tags } from './Tags'
import { useShortenerStore } from '../../Stores/useShortener'
import { useAuthStore } from '../../Stores/useAuth'
import { client } from '@workduck-io/dwindle'
import { resize } from '../../Utils/helper'
import { nanoid } from 'nanoid'

const Form = styled.form`
  display: flex;
  flex-direction: column;

  padding: 1rem;
`

export interface ShortenFormDetails {
  short: string
}

interface SitesMetadata {
  baseUrl: string
  metaTags: string[]
}

const sitesMetadataDict: SitesMetadata[] = [
  {
    baseUrl: 'https://linear.app/',
    metaTags: ['title']
  },
  {
    baseUrl: 'https://meet.google.com/',
    metaTags: ['title', 'description']
  },
  {
    baseUrl: 'https://github.com/',
    metaTags: ['title', 'description']
  },
  {
    baseUrl: 'https://mail.google.com/',
    metaTags: ['title', 'application-name']
  },
  {
    baseUrl: 'https://app.slack.com/',
    metaTags: ['title']
  },
  {
    baseUrl: 'https://airtable.com/',
    metaTags: ['title']
  },
  {
    baseUrl: 'https://www.figma.com/',
    metaTags: ['title']
  },
  {
    baseUrl: 'https://www.notion.so/',
    metaTags: ['title']
  },
  {
    baseUrl: 'atlassian.net',
    metaTags: ['title']
  }
]

export const AliasWrapper = () => {
  const [currTabURL, setCurrTabURL] = useState(document.referrer)
  const [pageMetaTags, setPageMetaTags] = useState<any[]>()
  const [userTags, setUserTags] = useState<Tag[]>([])
  const [shortenerResponse, setShortenerResponse] = useState<any>()
  const elementRef = useRef(null)

  const addLinkCapture = useShortenerStore((store) => store.addLinkCapture)
  // const addTagsToGlobalStore = useTagStore((store) => store.addTags)
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

    // TODO: think about this because we cannot directly use the extension store,
    // need to send message

    // addTagsToGlobalStore(reqBody.metadata.userTags)

    const URL = apiURLs.createShort
    let response: any
    try {
      response = await client.post(URL, reqBody, {
        headers: {
          'mex-workspace-id': workspaceDetails.id
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

  const handleEvent = (event: MessageEvent) => {
    switch (event.data.type) {
      case 'tab-info-response': {
        setCurrTabURL(event.data.data.url)
        const matchedURL = sitesMetadataDict.filter((e) => event.data.data.url.toString().includes(e.baseUrl))
        const resultUserTags: Tag[] = []
        if (matchedURL.length > 0) {
          for (const metaTag of matchedURL[0].metaTags) {
            for (const tag of event.data.data.tags) {
              if (tag.name === metaTag) {
                resultUserTags.push({ id: nanoid(), text: tag.value })
              }
            }
          }
        }
        setUserTags(resultUserTags)
      }
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
    // Tags result in height change
  }, [elementRef, userTags])

  // const addNewUserTag = (tag: Tag) => {
  //   setUserTags([...userTags, tag])
  // }

  // const removeUserTag = (tag: Tag) => {
  //   const t = userTags
  //   const idx = t.map((e) => e.id).indexOf(tag.id)
  //   t.splice(idx, 1)
  //   setUserTags([...t])
  // }

  // TODO: a provider for this too, or even better if we can let go of passing props. Why not let the components contain the logic
  return (
    <Form ref={elementRef} onSubmit={handleSubmit(onShortenLinkSubmit)}>
      <Shortener
        currTabURL={currTabURL}
        register={register}
        setCurrTabURL={setCurrTabURL}
        userTags={userTags}
        setUserTags={setUserTags}
      />
      {/* <Tags addNewTag={addNewUserTag} removeTag={removeUserTag} userTags={userTags} /> */}
      <Button type="submit" value="Save" />
    </Form>
  )
}
