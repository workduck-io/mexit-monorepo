import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'
import { toast, Toaster } from 'react-hot-toast'

import { Button, Input, InputRow, Label } from '@mexit/shared'
import { Tags } from './Tags'
import { useShortenerStore } from '../../Stores/useShortener'
import { useAuthStore } from '../../Stores/useAuth'
import { client } from '@workduck-io/dwindle'
import { resize } from '@mexit/shared'
import { nanoid } from 'nanoid'
import { apiURLs, CreateAlias, CreateTags, sitesMetadataDict, Tag } from '@mexit/core'

const Form = styled.form`
  display: flex;
  flex-direction: column;

  padding: 1rem;
`

export const Shortener = () => {
  const [currTabURL, setCurrTabURL] = useState<string>()
  const [pageMetaTags, setPageMetaTags] = useState<any[]>()
  const [userTags, setUserTags] = useState<Tag[]>([])
  const [short, setShort] = useState<string>()
  const [shortenerResponse, setShortenerResponse] = useState<any>()
  const elementRef = useRef(null)

  const addLinkCapture = useShortenerStore((store) => store.addLinkCapture)
  // const addTagsToGlobalStore = useTagStore((store) => store.addTags)
  const workspaceDetails = useAuthStore((store) => store.workspaceDetails)
  const userDetails = useAuthStore((store) => store.userDetails)

  const onShortenLinkSubmit = async () => {
    event.preventDefault()

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
        const { url, tags } = event.data.data
        setCurrTabURL(event.data.data.url)

        // Metatag Parsing
        const matchedURL = sitesMetadataDict.filter((e) => url.toString().includes(e.baseUrl))
        const resultUserTags: Tag[] = []
        let resultShortAlias: string = undefined
        // console.log({ matchedURL })

        if (matchedURL.length > 0) {
          const matchedMetaTags = []
          for (const metaTag of matchedURL[0].metaTags) {
            for (const tag of tags) {
              if (tag.name === metaTag) {
                resultShortAlias = CreateAlias(matchedURL[0].appName, tag)
                matchedMetaTags.push(tag)
                break
              }
            }
            if (resultShortAlias) break
          }

          // Add user tags for the keyword from the URL
          for (const keyword of matchedURL[0].keywords) {
            if (url.toString().includes(keyword) && resultUserTags.length === 0) {
              resultUserTags.push(...CreateTags(matchedURL[0].appName, url.toString(), keyword, matchedMetaTags[0]))
            }
          }

          // Add title as user tags if needed
          if (matchedURL[0].titleAsTag) {
            resultUserTags.push(
              ...CreateTags(matchedURL[0].appName, url.toString(), 'NA', matchedMetaTags[0], matchedURL[0].titleAsTag)
            )
          }
          if (resultUserTags.length === 0) resultUserTags.push(...CreateTags(matchedURL[0].appName, url.toString()))

          setShort(resultShortAlias)
          setUserTags(resultUserTags)
        } else {
          const title = tags.filter((el) => el.name === 'title')[0].value.trim()
          if (!resultShortAlias) resultShortAlias = title
          setUserTags([
            { id: nanoid(), text: title.toString().split('-').join(', ').split('|').join(', ').split(', ')[0] }
          ])
          setShort(resultShortAlias)
        }
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

  const removeUserTag = (tag: Tag) => {
    const updatedUserTags = userTags.filter((userTag) => tag.id !== userTag.id)
    setUserTags(updatedUserTags)
  }

  return (
    <Form ref={elementRef} onSubmit={onShortenLinkSubmit}>
      <InputRow>
        <Label>Destination URL</Label>
        <Input placeholder="URL to shorten" defaultValue={currTabURL} onChange={(e) => setCurrTabURL(e.target.value)} />
      </InputRow>
      <InputRow>
        <Tags
          userTags={userTags}
          addNewTag={(t) => setUserTags([...userTags, t])}
          removeTag={(t) => removeUserTag(t)}
        />
      </InputRow>

      <InputRow>
        <Label>Shortcut</Label>
        <Input placeholder="Shorcut" value={short} onChange={(event) => setShort(event.target.value)} />
      </InputRow>
      <Button type="submit" value="Save" />
    </Form>
  )
}
