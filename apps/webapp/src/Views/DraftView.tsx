import React, { useEffect, useState } from 'react'

import { uniq } from 'lodash'
import styled from 'styled-components'
import shallow from 'zustand/shallow'

import { defaultContent, ILink } from '@mexit/core'
import {
  Content,
  Group,
  IconDisplay,
  MainHeader,
  PageContainer,
  SnippetCommand,
  SnippetHeader,
  SSnippet,
  SSnippets,
  StyledSnippetPreview,
  Title
} from '@mexit/shared'

import EditorPreviewRenderer from '../Editor/EditorPreviewRenderer'
import { NavigationType, ROUTE_PATHS, useRouting } from '../Hooks/useRouting'
import { useContentStore } from '../Stores/useContentStore'
import { useDataStore } from '../Stores/useDataStore'
import { useMetadataStore } from '../Stores/useMetadataStore'
import { useRecentsStore } from '../Stores/useRecentsStore'

const CardsContainer = styled(SSnippets)`
  gap: ${({ theme }) => theme.spacing.large};
`

const Info = styled.span`
  color: ${({ theme }) => theme.tokens.text.fade};
  font-size: larger;
  font-weight: 700;
  line-height: 1.2;
`

const Card = styled(SSnippet)`
  margin: inherit;
`

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
        const ilink = ilinks.find((store) => store.nodeid === id)
        if (ilink) t.push(ilink)
      })
      setAllLinks(t)
    }
  }, [ilinks, bookmarks, lastOpened])

  const onOpen = (id: string) => {
    goTo(ROUTE_PATHS.editor, NavigationType.push, id)
  }

  return (
    <PageContainer>
      <MainHeader>
        <Title>Mex Activity!</Title>
      </MainHeader>

      <Content>
        {(!allLinks || allLinks.length === 0) && <Info>No Activity Found</Info>}
        <CardsContainer>
          {allLinks &&
            allLinks.map((s) => {
              const icon = useMetadataStore.getState().metadata.notes?.[s.nodeid]?.icon

              return (
                <Card key={`NODE_${s.nodeid}`}>
                  <SnippetHeader>
                    <Group>
                      <IconDisplay size={20} icon={icon} />
                      <SnippetCommand onClick={() => onOpen(s.nodeid)}>{s.path}</SnippetCommand>
                    </Group>
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
                </Card>
              )
            })}
        </CardsContainer>
      </Content>
    </PageContainer>
  )
}

export default DraftView
