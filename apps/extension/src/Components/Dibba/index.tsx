import React, { useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'

import { Icon } from '@iconify/react'
import { createPlateEditor, createPlateUI, serializeHtml } from '@udecode/plate'

import { DisplayShortcut } from '@workduck-io/mex-components'

import {
  apiURLs,
  convertToCopySnippet,
  defaultContent,
  defaultCopyConverter,
  defaultCopyFilter,
  ELEMENT_TAG,
  fuzzySearch,
  getMIcon,
  mog,
  NodeEditorContent,
  parseSnippet,
  QuickLinkType,
  SEPARATOR,
  Snippet
} from '@mexit/core'
import {
  ActionTitle,
  CenteredIcon,
  ComboboxItemTitle,
  ComboboxShortcuts,
  ComboSeperator,
  DefaultMIcons,
  IconDisplay,
  ItemCenterWrapper,
  ItemDesc,
  ItemRightIcons,
  ItemsContainer,
  ShortcutText
} from '@mexit/shared'

import { ElementTypeBasedShortcut } from '../../Editor/components/ComboBox'
import { CopyTag } from '../../Editor/components/Tags/CopyTag'
import { generateEditorPluginsWithComponents } from '../../Editor/plugins/index'
import { useAuthStore } from '../../Hooks/useAuth'
import { getPathFromNodeIdHookless } from '../../Hooks/useLinks'
import usePointerMovedSinceMount from '../../Hooks/usePointerMovedSinceMount'
import { useSputlitContext, VisualState } from '../../Hooks/useSputlitContext'
import { useContentStore } from '../../Stores/useContentStore'
import useDataStore from '../../Stores/useDataStore'
import { useLinkStore } from '../../Stores/useLinkStore'
import { useMetadataStore } from '../../Stores/useMetadataStore'
import { useSnippetStore } from '../../Stores/useSnippetStore'
import { getDibbaText } from '../../Utils/getDibbaText'
import { copySnippetToClipboard, getUpcomingData, simulateOnChange, supportedDomains } from '../../Utils/pasteUtils'
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
  const snippets = useSnippetStore((s) => Object.values(s.snippets ?? {}))

  const publicNodeIDs = useDataStore((store) => store.publicNodes)

  const pointerMoved = usePointerMovedSinceMount()

  const data = useMemo(
    () => [
      ...publicNodeIDs.map((noteId) => {
        const _content = getContent(noteId)

        return {
          type: QuickLinkType.publicNotes,
          id: noteId,
          icon: metadata.notes[noteId]?.icon,
          url: apiURLs.frontend.getPublicNodePath(noteId),
          title: getPathFromNodeIdHookless(noteId)?.split(SEPARATOR)?.pop(),
          content: _content?.content || defaultContent.content
        }
      }),
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
      }))
    ],
    [publicNodeIDs, snippets, linkCaptures]
  )

  const insertPublicNode = (item: PublicNode) => {
    const linkEle = document.createElement('a')
    linkEle.appendChild(document.createTextNode(item.title))
    linkEle.href = item.url

    dibbaState.extra.range.insertNode(linkEle)

    toast.success('Inserted Public Link!')
  }

  const insertLink = (item: any) => {
    // const link = document.createElement('a')
    // link.appendChild(document.createTextNode(item.title))
    // link.href = item.content
    if (!item) return

    const linkEle = document.createElement('a')
    linkEle.appendChild(document.createTextNode(item.title))
    linkEle.href = item.url

    dibbaState.extra.range.insertNode(linkEle)

    // // dibbaState.extra.range.insertNode(link)
    // dibbaState.extra.range.insertNode(document.createTextNode(`[[${item.url}]]`))
    // dibbaState.extra.range.collapse(false)

    // // Combining the inserted text node into one
    // document.activeElement.normalize()

    toast.success('Inserted Shortened URL!')
  }

  const handleClick = async (item: any) => {
    // TODO: this fails in keep
    try {
      // Extendering the range by 2 + text after trigger length i.e. search query
      const triggerRange = dibbaState.extra.range.cloneRange()
      triggerRange.setStart(
        triggerRange.startContainer,
        triggerRange.startOffset - dibbaState.extra.textAfterTrigger.length - 2
      )
      triggerRange.deleteContents()
    } catch (error) {
      console.log(error)
    }

    const originMatch = supportedDomains[window.location.origin]

    switch (item.type) {
      case QuickLinkType.snippet: {
        if (originMatch === 'html') {
          const filterdContent = convertToCopySnippet(item.content)
          const convertedContent = convertToCopySnippet(filterdContent, {
            filter: defaultCopyFilter,
            converter: defaultCopyConverter
          })

          const tempEditor = createPlateEditor({
            plugins: generateEditorPluginsWithComponents(
              createPlateUI({
                [ELEMENT_TAG]: CopyTag as any
              }),
              {
                exclude: { dnd: true }
              }
            )
          })

          const html = serializeHtml(tempEditor, {
            nodes: convertedContent
          })

          const node = new DOMParser().parseFromString(html, 'text/html').body
          dibbaState.extra.range.insertNode(node)
          dibbaState.extra.range.collapse(false)

          // Combining the inserted text node into one
          document.activeElement.normalize()
          simulateOnChange()
        } else if (originMatch === 'plain') {
          dibbaState.extra.range.insertNode(document.createTextNode(parseSnippet(item).text))
          dibbaState.extra.range.collapse(false)

          // Combining the inserted text node into one
          document.activeElement.normalize()
          simulateOnChange()
        } else {
          simulateOnChange()
          await copySnippetToClipboard(item as Snippet)
        }
        break
      }
      case QuickLinkType.webLinks: {
        insertLink(item)
        break
      }
      case QuickLinkType.publicNotes: {
        insertPublicNode(item as PublicNode)
      }
    }

    setDibbaState({ visualState: VisualState.hidden })
  }

  useEffect(() => {
    if (query) {
      const res = fuzzySearch(data, query, (item) => item.title)

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

      mog('RESULTS ARE', { res, items })
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
                  onMouseDown={() => {
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
