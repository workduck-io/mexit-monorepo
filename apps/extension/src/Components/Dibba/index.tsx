import React, { useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'

import { Icon } from '@iconify/react'

import { DisplayShortcut } from '@workduck-io/mex-components'

import {
  apiURLs,
  defaultContent,
  fuzzySearch,
  getMIcon,
  NodeEditorContent,
  QuickLinkType,
  SEPARATOR,
  Snippet,
  useAuthStore,
  useContentStore,
  useLinkStore,
  useMetadataStore,
  useSnippetStore
} from '@mexit/core'
import {
  ActionTitle,
  CenteredIcon,
  ComboboxItemTitle,
  ComboboxShortcuts,
  ComboSeperator,
  DefaultMIcons,
  getPathFromNodeIdHookless,
  IconDisplay,
  ItemCenterWrapper,
  ItemDesc,
  ItemRightIcons,
  ItemsContainer,
  ShortcutText
} from '@mexit/shared'

import { ElementTypeBasedShortcut } from '../../Editor/components/ComboBox'
import usePointerMovedSinceMount from '../../Hooks/usePointerMovedSinceMount'
import { useSputlitContext, VisualState } from '../../Hooks/useSputlitContext'
import { getDibbaText } from '../../Utils/getDibbaText'
import { copySnippetToClipboard, copyToClipboard, getUpcomingData, simulatePaste } from '../../Utils/pasteUtils'
import EditorPreviewRenderer from '../EditorPreviewRenderer'

import { ComboboxItem, ComboboxRoot } from './styled'

interface PublicNode {
  type: 'Public Nodes'
  id: string
  icon: string
  url: string
  title?: string
  content: NodeEditorContent
}

// TODO: whether or not to enable dibba should be a user's preference
// we don't users to move away because they have doubts of us forcing a 'keylogger' on them
export default function Dibba() {
  const { dibbaState, setDibbaState } = useSputlitContext()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [results, setResults] = useState([])
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)

  const dibbaRef = useRef(null)

  const top = window.scrollY + dibbaState.coordinates.top
  const left = window.scrollX + dibbaState.coordinates.left
  const [offsetTop, setOffsetTop] = useState(window.innerHeight < top + dibbaRef.current?.clientHeight)

  const metadata = useMetadataStore((s) => s.metadata)
  const linkCaptures = useLinkStore((store) => store.links.filter((i) => i.alias))
  const getContent = useContentStore((store) => store.getContent)
  const snippets = useSnippetStore((s) => Object.values<Snippet>(s.snippets ?? {}))

  const pointerMoved = usePointerMovedSinceMount()

  const publicNotes = useMemo(() => {
    const publicN = Object.entries<any>(metadata.notes).filter(([noteId, note]) => note.publicAccess)
    return publicN.map(([noteId, note]) => {
      const _content = getContent(noteId)

      const title = getPathFromNodeIdHookless(noteId)?.split(SEPARATOR)?.pop()

      return {
        type: QuickLinkType.publicNotes,
        id: noteId,
        icon: metadata.notes[noteId]?.icon,
        url: apiURLs.frontend.getPublicNodePath(noteId),
        title,
        content: _content?.content || defaultContent.content
      }
    })
  }, [metadata.notes])

  const data = useMemo(
    () => [
      ...snippets.map((item) => ({
        type: QuickLinkType.snippet,
        icon: metadata.snippets[item.id]?.icon || DefaultMIcons.SNIPPET,
        ...item
      })),
      ...linkCaptures.map((link) => ({
        icon: getMIcon('ICON', 'ri:link'),
        type: QuickLinkType.webLinks,
        title: link.alias,
        url: apiURLs.links.shortendLink(link?.alias, getWorkspaceId())
      })),
      ...publicNotes
    ],
    [publicNotes, snippets, linkCaptures]
  )

  const selectRange = () => {
    const state = dibbaState.extra

    try {
      if (state.isInputType) {
        state.node.select(state.range.startOffset, state.range.endOffset)
      } else {
        window.getSelection().getRangeAt(0).setStart(state.node, state.range.startOffset)
        window.getSelection().getRangeAt(0).setEnd(state.node, state.range.endOffset)
      }
    } catch (err) {
      console.error('Unable to select')
    }
  }

  const insertLink = (item: any) => {
    if (!item) return

    copyToClipboard(item.url, `<a href=${item.url}>${item.title}</a>`).then((s) => {
      simulatePaste()
      toast.success('Inserted Link!')
    })
  }

  const handleClick = async (item: any) => {
    try {
      selectRange()
      switch (item.type) {
        case QuickLinkType.snippet: {
          await copySnippetToClipboard(item, false)
          simulatePaste()
          break
        }
        case QuickLinkType.webLinks:
        case QuickLinkType.publicNotes: {
          insertLink(item)
          break
        }
      }
    } catch (err) {
      console.error('Handle Click Error', { err })
    } finally {
      setDibbaState({ visualState: VisualState.hidden })
    }
  }

  useEffect(() => {
    if (query) {
      let res = data
      try {
        res = fuzzySearch(data, query, (item) => item.title)
      } catch (err) {
        console.log('Fuzzy Search Error: ', { err })
      }

      const groups = res.reduce((acc, item) => {
        const type = item?.type
        if (!acc[type]) {
          acc[type] = []
        }

        if (!(acc[type].length === 5)) acc[type].push(item)

        return acc
      }, {} as any)

      const items = Object.values(groups).flat()

      if (items.length === 0) {
        items.push({
          id: 'no-results',
          title: 'No Results Found',
          icon: getMIcon('ICON', 'ri:alert-line')
        })
      }

      setResults(items)
    } else setResults(data)
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
        event.stopPropagation()

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
      onBlur={() => setDibbaState({ visualState: VisualState.hidden })}
      offsetTop={offsetTop}
      offsetRight={window.innerWidth < left + 550}
      isOpen={dibbaState.visualState === VisualState.showing}
    >
      <div id="List" style={{ flex: 1 }}>
        <ItemsContainer id="items-container">
          {results.map((item, index) => {
            const lastItem = index > 0 ? results[index - 1] : undefined
            return (
              <span key={`${item.key}-${String(index)}`}>
                {item.type !== lastItem?.type && <ActionTitle>{item.type}</ActionTitle>}
                <ComboboxItem
                  key={index}
                  highlighted={index === activeIndex}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleClick(item)
                  }}
                  onPointerMove={() => pointerMoved && setActiveIndex(index)}
                >
                  <CenteredIcon center padding>
                    <IconDisplay
                      key={item.id}
                      icon={item.icon}
                      size={item.type !== QuickLinkType.snippet ? 14 : undefined}
                    />
                  </CenteredIcon>
                  <ItemCenterWrapper>
                    <ComboboxItemTitle>{item.title}</ComboboxItemTitle>
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
              </span>
            )
          })}
        </ItemsContainer>
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
        <ComboSeperator fixedWidth>
          <section>
            <EditorPreviewRenderer noMouseEvents content={listItem.content} editorId={listItem.id} readOnly={true} />
          </section>
        </ComboSeperator>
      )}
    </ComboboxRoot>
  )
}
