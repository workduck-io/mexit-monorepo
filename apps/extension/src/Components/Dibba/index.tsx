import { LinkCapture, parseSnippet, Snippet } from '@mexit/shared'
import React from 'react'
import { useSnippets } from '../../Hooks/useSnippets'
import { useSputlitContext, VisualState } from '../../Hooks/useSputlitContext'
import { ComboboxItem, ComboboxRoot, Img, ItemCenterWrapper, ItemDesc, ItemTitle } from './styled'

import quillPenLine from '@iconify-icons/ri/quill-pen-line'
import { Icon } from '@iconify/react'
import { useShortenerStore } from '../../Hooks/useShortener'

// TODO: whether or not to enable dibba should be a user's preference
// we don't users to move away because they have doubts of us forcing a 'keylogger' on them
export default function Dibba() {
  const { dibbaState, setDibbaState } = useSputlitContext()
  const linkCaptures = useShortenerStore((store) => store.linkCaptures)
  const snippets = useSnippets().getSnippets()

  const data = [
    ...linkCaptures.map((item) => ({
      id: item.shortenedURL,
      title: item.short,
      // TODO: find a way to use favicons but single array of results
      icon: 'ri:link',
      content: item.shortenedURL
    })),
    ...snippets
  ]

  console.log('snippets', snippets, 'link Captures', linkCaptures)

  const insertSnippet = (item: Snippet) => {
    dibbaState.extra.range.deleteContents()
    dibbaState.extra.range.insertNode(document.createTextNode(parseSnippet(item).text))
    setDibbaState({ visualState: VisualState.hidden })
  }

  const insertLink = (item: any) => {
    const link = document.createElement('a')
    link.appendChild(document.createTextNode(item.content))
    link.href = item.content

    dibbaState.extra.range.deleteContents()
    dibbaState.extra.range.insertNode(link)
    setDibbaState({ visualState: VisualState.hidden })
  }

  const handleClick = (item: any) => {
    if (item.icon === 'ri:quill-pen-line') {
      insertSnippet(item as Snippet)
    } else {
      // TODO: transform again to type linkCapture
      insertLink(item)
    }
  }

  return (
    <ComboboxRoot
      top={window.scrollY + dibbaState.coordinates.top}
      left={window.scrollX + dibbaState.coordinates.left}
      isOpen={dibbaState.visualState === VisualState.hidden ? false : true}
    >
      {data.map((item, index) => {
        return (
          <ComboboxItem
            key={index}
            highlighted={false}
            onMouseDown={() => {
              console.log('something', item)
              handleClick(item)
            }}
          >
            <Icon height={18} key={item.id} icon={item.icon} />
            <ItemCenterWrapper>
              <ItemTitle>{item.title}</ItemTitle>
            </ItemCenterWrapper>
          </ComboboxItem>
        )
      })}
    </ComboboxRoot>
  )
}
