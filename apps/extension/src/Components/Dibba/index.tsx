import { LinkCapture, parseSnippet, QuickLinkType, Snippet } from '@mexit/core'
import React, { useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import fuzzysort from 'fuzzysort'

import { useSnippets } from '../../Hooks/useSnippets'
import { useSputlitContext, VisualState } from '../../Hooks/useSputlitContext'
import { ComboboxItem, ComboboxRoot, ItemCenterWrapper, ItemDesc, ItemRightIcons, ItemTitle } from './styled'
import { useShortenerStore } from '../../Hooks/useShortener'
import { getDibbaText } from '../../Utils/getDibbaText'
import { ComboboxShortcuts, ComboSeperator, DisplayShortcut, ShortcutText } from '@mexit/shared'
import { ElementTypeBasedShortcut } from '../../Editor/components/ComboBox'
import EditorPreviewRenderer from '../EditorPreviewRenderer'
import usePointerMovedSinceMount from '../../Hooks/usePointerMovedSinceMount'

// This functions provides the 'to be' range and text content
// Needed because keydown event happens before there is a selection or content change
function getUpcomingData(selection: Selection) {
  const ogRange = selection.getRangeAt(0)

  // Shifitng both start and end offset to simulate backwards caret movement
  const range = ogRange.cloneRange()
  range.setStart(ogRange.startContainer, ogRange.startOffset - 1)
  range.setEnd(ogRange.endContainer, ogRange.endOffset - 1)

  // delete last character of current content
  const text = selection.anchorNode.textContent.slice(0, -1)

  return { range, text }
}

// TODO: whether or not to enable dibba should be a user's preference
// we don't users to move away because they have doubts of us forcing a 'keylogger' on them
export default function Dibba() {
  const { dibbaState, setDibbaState } = useSputlitContext()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [results, setResults] = useState([])
  const dibbaRef = useRef(null)

  const top = window.scrollY + dibbaState.coordinates.top
  const left = window.scrollX + dibbaState.coordinates.left
  const [offsetTop, setOffsetTop] = useState(window.innerHeight < top + dibbaRef.current?.clientHeight)

  const linkCaptures = useShortenerStore((store) => store.linkCaptures)
  const snippets = useSnippets().getSnippets()
  const pointerMoved = usePointerMovedSinceMount()

  const data = [
    ...linkCaptures.map((item) => ({
      id: item.shortenedURL,
      title: item.short,
      icon: 'ri:link',
      content: item.shortenedURL
    })),
    ...snippets.map((item) => ({
      type: QuickLinkType.snippet,
      ...item
    }))
  ]

  const insertSnippet = (item: Snippet) => {
    dibbaState.extra.range.insertNode(document.createTextNode(parseSnippet(item).text))
    dibbaState.extra.range.collapse(false)

    // Combining the inserted text node into one
    document.activeElement.normalize()
  }

  const insertLink = (item: any) => {
    const link = document.createElement('a')
    link.appendChild(document.createTextNode(item.title))
    link.href = item.content

    dibbaState.extra.range.insertNode(link)
    dibbaState.extra.range.collapse(false)

    // Combining the inserted text node into one
    document.activeElement.normalize()
  }

  const handleClick = (item: any) => {
    // TODO: this fails in keep
    try {
      // Extendering the range by 2 + text after trigger length i.e. search query
      let triggerRange = dibbaState.extra.range.cloneRange()
      triggerRange.setStart(
        triggerRange.startContainer,
        triggerRange.startOffset - dibbaState.extra.textAfterTrigger.length - 2
      )
      triggerRange.deleteContents()
    } catch (error) {
      console.log(error)
    }

    if (item.icon === 'ri:quill-pen-line') {
      insertSnippet(item as Snippet)
    } else if (item.icon === 'ri:link') {
      // TODO: transform again to type linkCapture
      insertLink(item)
    }

    setDibbaState({ visualState: VisualState.hidden })
  }

  useEffect(() => {
    if (query !== '') {
      const res = fuzzysort.go(query, data, { key: 'title', allowTypo: true }).map((item) => item.obj)

      if (res.length === 0) {
        res.push({
          id: 'no-results',
          title: 'No Results Found',
          icon: 'ri:alert-line',
          content: ''
        })
      }

      setResults(res)
    } else {
      setResults(data)
    }
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
      }
      // TODO: should only listen for this on chromium browsers
      // because of the active bug of selectionchange not triggering on backspace
      // https://bugs.chromium.org/p/chromium/issues/detail?id=725890
      else if (event.key === 'Backspace') {
        const selection = window.getSelection()
        const { range, text } = getUpcomingData(selection)
        const textAfterTrigger = getDibbaText(range, text)

        if (textAfterTrigger) {
          setDibbaState({
            visualState: VisualState.showing,
            coordinates: range.getClientRects()[0],
            extra: textAfterTrigger
          })
        } else {
          setDibbaState({ visualState: VisualState.hidden })
        }
      }
    }

    const contentEditable = document.activeElement

    contentEditable.addEventListener('keydown', handleKeyDown)

    return () => {
      contentEditable.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeIndex, results])

  useEffect(() => {
    setQuery(dibbaState.extra.textAfterTrigger)
  }, [dibbaState.extra])

  useEffect(() => {
    setOffsetTop(window.innerHeight < top + dibbaRef.current.clientHeight)
  })

  const listItem = results[activeIndex]
  const itemShortcut = listItem?.type ? ElementTypeBasedShortcut[listItem?.type] : undefined

  return (
    <ComboboxRoot
      id="dibba-container"
      ref={dibbaRef}
      top={top}
      left={left}
      offsetTop={offsetTop}
      offsetRight={window.innerWidth < left + 500}
      isOpen={dibbaState.visualState === VisualState.showing}
    >
      <div style={{ flex: 1 }}>
        {results.map((item, index) => {
          return (
            <ComboboxItem
              key={index}
              highlighted={index === activeIndex}
              onMouseDown={() => {
                handleClick(item)
              }}
              onPointerMove={() => pointerMoved && setActiveIndex(index)}
            >
              <Icon height={18} key={item.id} icon={item.icon} />
              <ItemCenterWrapper>
                <ItemTitle>{item.title}</ItemTitle>
                {item.desc && <ItemDesc>{item.desc}</ItemDesc>}
              </ItemCenterWrapper>
              {item.rightIcons && (
                <ItemRightIcons>
                  {item.rightIcons.map((i: string) => (
                    <Icon key={item.key + i} icon={i} />
                  ))}
                </ItemRightIcons>
              )}
            </ComboboxItem>
          )
        })}
        {itemShortcut && (
          <ComboboxShortcuts>
            {Object.entries(itemShortcut).map(([key, shortcut]) => {
              return (
                <ShortcutText key={key}>
                  <DisplayShortcut shortcut={shortcut.keystrokes} /> <div className="text">{shortcut.title}</div>
                </ShortcutText>
              )
            })}
          </ComboboxShortcuts>
        )}
      </div>

      {listItem?.content && (
        <ComboSeperator>
          <section>
            <EditorPreviewRenderer noMouseEvents content={listItem.content} editorId={listItem.id} />
          </section>
        </ComboSeperator>
      )}
    </ComboboxRoot>
  )
}
