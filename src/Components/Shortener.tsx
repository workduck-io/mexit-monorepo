import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { client } from '@workduck-io/dwindle'

import { useAuthStore } from '../Hooks/useAuth'
import { useShortenerStore } from '../Hooks/useShortener'
import { useTagStore } from '../Hooks/useTags'
import { getCurrentTab, checkMetaParseableURL } from '../Utils/tabInfo'
import { apiURLs } from '../routes'
import { Tag } from '../Types/Tags'

interface ShortenFormDetails {
  short: string
  namespace?: string
}

interface ShortenerProps {
  currTabURL: string
  pageMetaTags?: any[]
  userTags: Tag[]
}

const Shortener: React.FC<ShortenerProps> = ({ currTabURL, pageMetaTags, userTags }: ShortenerProps) => {
  const [shortenerResponse, setShortenerResponse] = useState<any>()
  // const userDetails = useAuthStore((store) => store.userDetails)
  const workspaceDetails = useAuthStore((store) => store.workspaceDetails)

  const addLinkCapture = useShortenerStore((store) => store.addLinkCapture)

  const { handleSubmit, register } = useForm<ShortenFormDetails>()
  const addTagsToGlobalStore = useTagStore((store) => store.addTags)

  const onShortenLinkSubmit = (data: ShortenFormDetails) => {
    const { short, namespace } = data

    addTagsToGlobalStore(userTags)

    const reqBody = {
      long: currTabURL,
      short: short,
      namespace: workspaceDetails.name,
      metadata: {
        metaTags: pageMetaTags,
        userTags: userTags
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
        <input placeholder="Workspace Name" readOnly={true} value={workspaceDetails.name} {...register('namespace')} />
        <input type="submit" />
      </form>
      <p>{JSON.stringify(shortenerResponse)}</p>
    </>
  )
}

export default Shortener
