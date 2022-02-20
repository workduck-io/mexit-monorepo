import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'
import { toast, Toaster } from 'react-hot-toast'

import { Button } from '../../../mexit/src/Styles/Button'
import { useActionsStore } from '../../../mexit/src/Hooks/useActions'
import { Tag } from '../../../mexit/src/Hooks/useTags'
import { checkMetaParseableURL, parsePageMetaTags } from '../../../mexit/src/Utils/tabInfo'
import Shortener from './Shortener'
import Tags from './Tags'
import { closeSputlit } from '../../../mexit/src/contentScript'
import { CaptureType } from '../../../mexit/src/Types/Editor'

const Form = styled.form`
  display: flex;
  flex-direction: column;

  margin: 1rem;
`

export interface ShortenFormDetails {
  short: string
}

function AliasWrapper() {
  const [currTabURL, setCurrTabURL] = useState(window.location.href)
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
        type: 'CAPTURE_HANDLER',
        subType: 'CREATE_SHORT_URL',
        data: {
          body: reqBody
        }
      },
      (response) => {
        const { message, error } = response
        if (error) {
          if (error === 'Not Authenticated') {
            toast.error('Not Authenticated. Please login via Popup')
          } else if (error.data.message === 'URL already exists') {
            toast.error('Alias Already Exists, choose another')
          } else {
            toast.error('An Error Occured. Please try again')
          }
        } else {
          const shortenerReqBody = {
            ...message,
            path: '',
            type: CaptureType.LINK
          }
          chrome.runtime.sendMessage(
            {
              type: 'CAPTURE_HANDLER',
              subType: 'CREATE_LINK_QC',
              data: {
                body: shortenerReqBody
              }
            },
            (response) => {
              const { message, error } = response
              if (error) {
                if (error === 'Not Authenticated') {
                  toast.error('Not Authenticated. Please login via Popup')
                } else if (error.data.message === 'URL already exists') {
                  toast.error('Alias Already Exists, choose another')
                } else {
                  toast.error('An Error Occured. Please try again')
                }
              } else {
                const text = message.data.shortenedURL
                navigator.clipboard
                  .writeText(text)
                  .then(() => {
                    toast.success('Successful! Aliased URL Copied to Clipboard', { duration: 2000 })
                  })
                  .catch((err) => {
                    toast.error('An error occurred. Please try again later')
                  })
                setTimeout(() => {
                  closeSputlit()
                }, 2000)
              }
            }
          )
        }
      }
    )
  }

  /* Try to fetch page metadata using content script*/
  useEffect(() => {
    if (checkMetaParseableURL(currTabURL)) {
      const mt = parsePageMetaTags()
      setPageMetaTags(mt)
    }
  }, [currTabURL])

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
    <>
      <Form onSubmit={handleSubmit(onShortenLinkSubmit)}>
        <Shortener currTabURL={currTabURL} register={register} setCurrTabURL={setCurrTabURL} />
        <Tags addNewTag={addNewUserTag} removeTag={removeUserTag} userTags={userTags} />
        <Button type="submit" value="Save" />
      </Form>
      <Toaster position="bottom-center" />
    </>
  )
}

export default AliasWrapper
