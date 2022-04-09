import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { UseFormRegister } from 'react-hook-form'
import { ShortenFormDetails } from './AliasWrapper'
import { InputRow, Label, Input, Tag, parsePageMetaTags } from '@mexit/shared'
import { Tags } from './Tags'
import { nanoid } from 'nanoid'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

interface SitesMetadata {
  baseUrl: string
  metaTags: string[]
}

const sitesMetadataDict: SitesMetadata[] = [
  {
    baseUrl: 'https://meet.google.com/',
    metaTags: ['title', 'description']
  }
]

export const Shortener = ({
  currTabURL,
  setCurrTabURL,
  register
}: {
  currTabURL: string
  setCurrTabURL: (s: string) => void
  register: UseFormRegister<ShortenFormDetails>
}) => {
  const [userTags, setUserTags] = useState<Tag[]>([])

  useEffect(() => {
    // async function fetchHTMLFromURL() {
    //   const html = await (await fetch(currTabURL)).text()
    //   const doc = new DOMParser().parseFromString(html, 'text/html')
    //   return doc
    // }
    for (const siteMetaDict of sitesMetadataDict) {
      if (currTabURL.includes(siteMetaDict.baseUrl)) {
        for (const metaTag of siteMetaDict.metaTags) {
          let title: string

          setUserTags([{ id: nanoid(), value: parsePageMetaTags()[1].value }])
        }
      }
    }
  }, [currTabURL])

  const removeUserTag = (tag: Tag) => {
    const updatedUserTags = userTags.filter((userTag) => tag.id !== userTag.id)
    setUserTags(updatedUserTags)
  }
  return (
    <Container>
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
        <Input placeholder="Shorcut" {...register('short')} />
      </InputRow>
    </Container>
  )
}
