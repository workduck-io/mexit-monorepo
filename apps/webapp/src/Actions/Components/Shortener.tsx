import React, { useEffect, useRef, useState } from 'react'

import { nanoid } from 'nanoid'
import { useForm } from 'react-hook-form'
import { toast, Toaster } from 'react-hot-toast'
import styled from 'styled-components'

import { LoadingButton, Button } from '@workduck-io/mex-components'

import { getValidTitle, metadataParser, Tag } from '@mexit/core'
import { copyTextToClipboard, Input, Label, resize } from '@mexit/shared'

import { TagsLabel } from '../../Components/Sidebar/TagLabel'
import { useURLsAPI } from '../../Hooks/useURLs'
import { useAuthStore } from '../../Stores/useAuth'
import { useDataStore } from '../../Stores/useDataStore'
import { Link } from '../../Stores/useLinkStore'

const Form = styled.form`
  display: flex;
  flex-direction: column;

  padding: 1rem;
`

const InputRow = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.75rem 0;
`

export const Shortener = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [tabUrl, setTabUrl] = useState('')
  const [tabTitle, setTabTitle] = useState('')
  const [tags, setTags] = useState<Tag[]>([])
  const [short, setShort] = useState<string>()

  const elementRef = useRef(null)
  const { saveLink } = useURLsAPI()

  const onShortenLinkSubmit = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)

    const reqBody: Link = {
      url: tabUrl,
      title: tabTitle,
      tags: tags.map((item) => item.value),

      alias: getValidTitle(short),
      createdAt: Date.now()
    }

    const shortenedLink = await saveLink(reqBody)
    setIsLoading(false)

    copyTextToClipboard(shortenedLink)
  }

  const removeUserTag = (tag: string) => {
    const updatedUserTags = tags.filter((userTag) => tag !== userTag.value)
    setTags(updatedUserTags)
  }

  useEffect(() => {
    const handleEvent = (event: MessageEvent) => {
      switch (event.data.type) {
        case 'tab-info-response': {
          const { url, pageTags } = event.data.data
          setTabUrl(url)
          setTabTitle(pageTags.find((item) => item.name === 'title').value)

          const { resultUserTags, resultShortAlias } = metadataParser(url, pageTags)
          setTags(resultUserTags)
          setShort(resultShortAlias)
        }
      }
    }

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
  }, [elementRef, tags])

  return (
    <Form ref={elementRef} onSubmit={onShortenLinkSubmit}>
      <InputRow>
        <Label>Destination URL</Label>
        <Input placeholder="URL to shorten" defaultValue={tabUrl} onChange={(e) => setTabUrl(e.target.value)} />
      </InputRow>
      {/* TODO: temporarily removing ability to enter your own tags  */}
      <TagsLabel tags={tags} onDelete={(t) => removeUserTag(t)} />

      <InputRow>
        <Label>Shortcut</Label>
        <Input placeholder="Shorcut" value={short} onChange={(event) => setShort(getValidTitle(event.target.value))} />
      </InputRow>
      <LoadingButton loading={isLoading} onClick={onShortenLinkSubmit} type="submit">
        Save
      </LoadingButton>
    </Form>
  )
}
