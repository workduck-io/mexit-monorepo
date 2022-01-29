import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Tag } from '../Types/Tags'

interface ShortenFormDetails {
  short: string
}

interface ShortenerProps {
  currTabURL: string
  pageMetaTags?: any[]
  userTags: Tag[]
}

const Shortener: React.FC<ShortenerProps> = ({ currTabURL, pageMetaTags, userTags }: ShortenerProps) => {
  const [shortenerResponse, setShortenerResponse] = useState<any>()
  const [sendToBackend, setSendToBackend] = useState(false)
  const [linkQCBackendResponse, setLinkQCBackendResponse] = useState<any>({})
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
          setSendToBackend(true)
        }
      }
    )

    if (sendToBackend) {
      chrome.runtime.sendMessage(
        {
          type: 'DISPATH_DWINDLE_REQUEST',
          subType: 'CREATE_LINK_QC',
          data: {
            body: {
              ...reqBody,
              shortenedURL: shortenerResponse.data.message
            }
          }
        },
        (response) => {
          const { message, error } = response
          if (error) {
            setLinkQCBackendResponse({ message: 'An Error Occured. Please try again later' })
            console.error('Err is: ', error)
          } else {
            setLinkQCBackendResponse(message)
          }
        }
      )
    }
  }

  return (
    <>
      <p>Shorten Your Link!</p>
      <p>Your current URL is: {currTabURL}</p>
      <form onSubmit={handleSubmit(onShortenLinkSubmit)}>
        <input placeholder="short alias you would like to give" {...register('short')} />
        <input type="submit" />
      </form>
      <p>{JSON.stringify(shortenerResponse)}</p>
    </>
  )
}

export default Shortener
