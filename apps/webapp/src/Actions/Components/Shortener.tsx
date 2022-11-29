import { getValidTitle, Link, metadataParser, mog,Tag } from '@mexit/core'
import { AddTagMenu,copyTextToClipboard, Input, Label, LinkTagSection, resize, TagsLabel } from '@mexit/shared'
import { LoadingButton } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'
import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import styled from 'styled-components'

import { useURLsAPI } from '../../Hooks/useURLs'
import { useLinkStore } from '../../Stores/useLinkStore'

const Form = styled.form`
  display: flex;
  flex-direction: column;

  padding: ${({ theme }) => `${theme.spacing.medium} ${theme.spacing.large} ${theme.spacing.large}`};
`

const InputRow = styled.div<{ noTopMargin?: boolean }>`
  display: flex;
  flex-direction: column;

  margin: ${({ noTopMargin, theme }) => (noTopMargin ? `0 0 ${theme.spacing.large}` : `${theme.spacing.large} 0`)};
`

export const Shortener = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [tabUrl, setTabUrl] = useState('')
  const [tabTitle, setTabTitle] = useState('')
  const [tags, setTags] = useState<Tag[]>([])
  const [short, setShort] = useState<string>()

  const elementRef = useRef(null)
  const { saveLink } = useURLsAPI()
  const addLink = useLinkStore((store) => store.addLink)

  const onShortenLinkSubmit = useCallback(
    async (e?: any) => {
      e.preventDefault()
      mog('shortening', { short, tags, tabUrl, tabTitle })

      try {
        setIsLoading(true)

        const reqBody: Link = {
          url: tabUrl,
          title: tabTitle,
          tags: tags.map((item) => item.value),

          alias: getValidTitle(short),
          createdAt: Date.now()
        }

        const shortenedLink = await saveLink(reqBody)

        addLink(reqBody)
        copyTextToClipboard(shortenedLink?.message)
      } catch (err) {
        toast('Unable to save the shortened URL!')
        mog('Something went wrong in Shorten URL', { err })
      } finally {
        setIsLoading(false)
      }
    },
    [tags, short, tabTitle, tabUrl]
  )

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

  const onAddTag = (tag: Tag) => {
    setTags([...tags.filter((t) => t.value !== tag.value), tag])
  }

  const onCreateNewTag = (tag: string) => {
    setTags([...tags.filter((t) => t.value !== tag), { value: tag }])
  }

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+Enter': (ev) => {
        onShortenLinkSubmit(ev)
      }
    })

    return () => unsubscribe()
  }, [onShortenLinkSubmit])

  useEffect(() => {
    if (elementRef !== null) {
      resize(elementRef)
    }
    // Tags result in height change
  }, [elementRef, tags])

  return (
    <Form ref={elementRef} onSubmit={onShortenLinkSubmit}>
      <InputRow noTopMargin>
        <Label noTopMargin>Destination URL</Label>
        <Input placeholder="URL to shorten" defaultValue={tabUrl} onChange={(e) => setTabUrl(e.target.value)} />
      </InputRow>
      {/* TODO: temporarily removing ability to enter your own tags  */}
      <LinkTagSection>
        <TagsLabel tags={tags} onDelete={(t) => removeUserTag(t)} />
        <AddTagMenu createTag={onCreateNewTag} tags={tags} addTag={onAddTag} />
      </LinkTagSection>

      <InputRow>
        <Label>Add an Alias</Label>
        <Input placeholder="Shorcut" value={short} onChange={(event) => setShort(getValidTitle(event.target.value))} />
      </InputRow>
      <LoadingButton id="mex-save-shortened-url" loading={isLoading} type="submit">
        Save
      </LoadingButton>
    </Form>
  )
}
