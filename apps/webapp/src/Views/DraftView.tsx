import React, { useEffect, useState } from 'react'
import shallow from 'zustand/shallow'

import { Wrapper } from '@mexit/shared'
import { defaultContent, ILink, uniq } from '@mexit/core'

import { useRouting, ROUTE_PATHS, NavigationType } from '../Hooks/useRouting'
import { Title } from '@mexit/shared'
import { SSnippets, SSnippet, SnippetHeader, SnippetCommand, StyledSnippetPreview } from '@mexit/shared'
import { useRecentsStore } from '../Stores/useRecentsStore'
import { useDataStore } from '../Stores/useDataStore'
import { useContentStore } from '../Stores/useContentStore'
import EditorPreviewRenderer from '../Editor/EditorPreviewRenderer'

function DraftView() {
  const { contents } = useContentStore()
  const [ilinks, bookmarks] = useDataStore((store) => [store.ilinks, store.bookmarks], shallow)
  const lastOpened = useRecentsStore((store) => store.lastOpened)
  const { goTo } = useRouting()

  const [allLinks, setAllLinks] = useState<ILink[]>()

  useEffect(() => {
    if (ilinks && ilinks.length > 0) {
      const t = []
      const activityItems = uniq([...bookmarks, ...lastOpened])
      activityItems.forEach((id) => {
        t.push(ilinks.find((store) => store.nodeid === id))
      })
      setAllLinks(t)
    }
  }, [ilinks, bookmarks, lastOpened])

  const onOpen = (id: string) => {
    goTo(ROUTE_PATHS.editor, NavigationType.push, id)
  }

  return (
    <Wrapper>
      <Title>Mex Activity!</Title>
      <SSnippets>
        {!allLinks || allLinks.length === 0 ? (
          <h3>No Activity Found. Open Nodes and Bookmark Them, Then Come Back!</h3>
        ) : (
          ''
        )}
        {allLinks &&
          allLinks.map((s) => (
            <SSnippet key={`NODE_${s.nodeid}`}>
              <SnippetHeader>
                <SnippetCommand onClick={() => onOpen(s.nodeid)}>{s.path}</SnippetCommand>
              </SnippetHeader>

              <StyledSnippetPreview
                onClick={() => {
                  onOpen(s.nodeid)
                }}
              >
                <EditorPreviewRenderer
                  content={contents[s.nodeid] ? contents[s.nodeid].content : defaultContent.content}
                  editorId={`Editor_Embed_${s.nodeid}`}
                  draftView
                />
              </StyledSnippetPreview>
            </SSnippet>
          ))}
      </SSnippets>
    </Wrapper>
  )
}

export default DraftView
