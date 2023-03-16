import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'

import styled from 'styled-components'

import { LoadingButton } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'

import { getValidTitle, Link, metadataParser, mog, Tag , useLinkStore } from '@mexit/core'
import { AddTagMenu, copyTextToClipboard, Input, Label, LinkTagSection, resize, TagsLabel } from '@mexit/shared'

import { useURLsAPI } from '../../Hooks/useURLs'

const Form = styled.form`
  display: flex;
  flex-direction: column;

  padding: ${({ theme }) => `${theme.spacing.medium} ${theme.spacing.large} ${theme.spacing.large}`};
  background: ${({ theme }) => theme.tokens.surfaces.app};
`

const InputRow = styled.div<{ noTopMargin?: boolean }>`
  display: flex;
  flex-direction: column;

  margin: ${({ noTopMargin, theme }) => (noTopMargin ? `0 0 ${theme.spacing.large}` : `${theme.spacing.large} 0`)};
`

export const Shortener = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [link, setLink] = useState<Link>(null)
  const { saveLink } = useURLsAPI()
  const addLink = useLinkStore((store) => store.addLink)

  const elementRef = useRef(null)

  const tags = useMemo(() => {
    if (!link) return []

    return link.tags?.map((t) => ({ value: t })) ?? []
  }, [link])

  const onShortenLinkSubmit = useCallback(
    async (e?: any) => {
      e.preventDefault()
      mog('shortening', { link })

      try {
        setIsLoading(true)

        const shortenedLink = await saveLink(link)
        addLink(link)
        copyTextToClipboard(shortenedLink?.message)
      } catch (err) {
        toast('Unable to save the shortened URL!')
        mog('Something went wrong in Shorten URL', { err })
      } finally {
        setIsLoading(false)
      }
    },
    [link]
  )

  const removeUserTag = (tag: string) => {
    const updatedUserTags = link.tags.filter((userTag) => tag !== userTag)
    setLink({ ...link, tags: updatedUserTags })
  }

  useEffect(() => {
    const handleEvent = (event: MessageEvent) => {
      switch (event.data.type) {
        case 'tab-info-response': {
          const { url, pageTags } = event.data.data
          const { resultUserTags, resultShortAlias } = metadataParser(url, pageTags)

          setLink({
            url: url,
            title: pageTags.find((item) => item.name === 'title')?.value,
            imgSrc: pageTags.find((i) => i.name === 'og:image')?.value,
            description: pageTags.find((i) => i.name === 'description')?.value,
            tags: resultUserTags.map((tag) => tag.value),
            alias: getValidTitle(resultShortAlias),
            createdAt: Date.now()
          })
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
    setLink({ ...link, tags: [...link.tags, tag.value] })
  }

  const onCreateNewTag = (tag: string) => {
    setLink({ ...link, tags: [...link.tags, tag] })
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
  }, [elementRef, link?.tags])

  return (
    <Form ref={elementRef} onSubmit={onShortenLinkSubmit}>
      <InputRow noTopMargin>
        <Label noTopMargin>Destination URL</Label>
        <Input
          placeholder="URL to shorten"
          defaultValue={link?.url}
          onChange={(e) => setLink({ ...link, url: e.target.value })}
        />
      </InputRow>

      <LinkTagSection>
        <TagsLabel tags={tags} onDelete={(t) => removeUserTag(t)} />
        <AddTagMenu createTag={onCreateNewTag} tags={tags} addTag={onAddTag} />
      </LinkTagSection>

      <InputRow>
        <Label>Add an Alias</Label>
        <Input
          placeholder="Shorcut"
          value={link?.alias}
          onChange={(event) => setLink({ ...link, alias: getValidTitle(event.target.value) })}
        />
      </InputRow>
      <LoadingButton id="mex-save-shortened-url" loading={isLoading} type="submit">
        Save
      </LoadingButton>
    </Form>
  )
}
