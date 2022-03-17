import { LinkCapture, parseSnippet, Snippet } from '@mexit/shared'
import React, { useEffect, useState } from 'react'
import { useSnippets } from '../../Hooks/useSnippets'
import { useSputlitContext, VisualState } from '../../Hooks/useSputlitContext'
import { ComboboxItem, ComboboxRoot, Img, ItemCenterWrapper, ItemDesc, ItemTitle } from './styled'

import quillPenLine from '@iconify-icons/ri/quill-pen-line'
import { Icon } from '@iconify/react'
import { useShortenerStore } from '../../Hooks/useShortener'
import fuzzysort from 'fuzzysort'

// TODO: whether or not to enable dibba should be a user's preference
// we don't users to move away because they have doubts of us forcing a 'keylogger' on them
export default function Dibba() {
  const { dibbaState, setDibbaState } = useSputlitContext()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [results, setResults] = useState([])

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

  const insertSnippet = (item: Snippet) => {
    dibbaState.extra.range.deleteContents()
    dibbaState.extra.range.insertNode(document.createTextNode(parseSnippet(item).text))
  }

  const insertLink = (item: any) => {
    const link = document.createElement('a')
    link.appendChild(document.createTextNode(item.content))
    link.href = item.content

    dibbaState.extra.range.deleteContents()
    dibbaState.extra.range.insertNode(link)
  }

  const handleClick = (item: any) => {
    if (item.icon === 'ri:quill-pen-line') {
      insertSnippet(item as Snippet)
    } else {
      // TODO: transform again to type linkCapture
      insertLink(item)
    }
    setDibbaState({ visualState: VisualState.hidden })
  }

  useEffect(() => {
    if (query !== '') {
      const res = fuzzysort.go(query, data, { key: 'title' }).map((item) => item.obj)
      setResults(res)
    } else {
      setResults(data)
    }

    console.log('current query', query)
  }, [query])

  useEffect(() => {
    setActiveIndex(0)
  }, [results])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowDown') {
        event.preventDefault()

        setActiveIndex(activeIndex < results.length - 1 ? activeIndex + 1 : activeIndex)
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()

        setActiveIndex(activeIndex > 0 ? activeIndex - 1 : activeIndex)
      } else if (event.key === 'Escape') {
        event.preventDefault()

        setDibbaState({ visualState: VisualState.hidden })
      } else if (['Tab', 'Enter', ' ', ']'].includes(event.key)) {
        event.preventDefault()

        handleClick(results[activeIndex])
      } else {
        // TODO: fix or add something to know when the cursor has moved past the trigger
        if (event.key === 'Backspace') {
          setQuery(query.slice(0, -1))
        } else {
          setQuery(query + event.key)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, results])

  useEffect(() => console.log('active index', activeIndex), [activeIndex])

  return (
    <ComboboxRoot
      top={window.scrollY + dibbaState.coordinates.top}
      left={window.scrollX + dibbaState.coordinates.left}
      isOpen={dibbaState.visualState === VisualState.hidden ? false : true}
    >
      {results.map((item, index) => {
        return (
          <ComboboxItem
            key={index}
            highlighted={index === activeIndex}
            onMouseDown={() => {
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
