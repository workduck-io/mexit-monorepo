import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'
import { useActionsStore } from '../Hooks/useActions'
import { Tag } from '../Hooks/useTags'
import { checkMetaParseableURL, getCurrentTab, parsePageMetaTags } from '../Utils/tabInfo'
import Shortener from './Shortener'
import Tags from './Tags'
import toast, { Toaster } from 'react-hot-toast'

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
    console.log('Sending Runtime Message')
    chrome.runtime.sendMessage(
      {
        type: 'CAPTURE_HANDLER',
        subType: 'CREATE_SHORT_URL',
        data: {
          body: reqBody
        }
      },
      (response) => {
        console.log('Received Response: ', response)
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
          toast.success('Successful!')
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
        <SubmitButton type="submit" value="Save" />
      </Form>
      <Toaster position="bottom-center" />
    </>
  )
}

export default AliasWrapper
