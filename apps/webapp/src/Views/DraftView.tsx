import { useEffect, useState } from 'react'

import { uniq } from 'lodash'
import styled from 'styled-components'
import shallow from 'zustand/shallow'

import { defaultContent, ILink, useMetadataStore } from '@mexit/core'
import {
  Content,
  Group,
  IconDisplay,
  MainHeader,
  PageContainer,
  Result,
  ResultHeader,
  Results,
  ResultTitle,
  SearchPreviewWrapper,
  Title,
  ViewType
} from '@mexit/shared'

import NamespaceTag from '../Components/NamespaceTag'
import EditorPreviewRenderer from '../Editor/EditorPreviewRenderer'
import { useNamespaces } from '../Hooks/useNamespaces'
import { NavigationType, ROUTE_PATHS, useRouting } from '../Hooks/useRouting'
import { useContentStore } from '../Stores/useContentStore'
import { useDataStore } from '../Stores/useDataStore'
import { useRecentsStore } from '../Stores/useRecentsStore'

const CardsContainer = styled(Results)`
  height: calc(100vh - ${({ theme }) => (theme.additional.hasBlocks ? '2rem' : '0rem')} - 12rem);
  margin: ${({ theme }) => theme.spacing.large} 0 0;
`

const Info = styled.span`
  color: ${({ theme }) => theme.tokens.text.fade};
  font-size: larger;
  font-weight: 700;
  line-height: 1.2;
`

function DraftView() {
  const contents = useContentStore((s) => s.contents)
  const [ilinks, bookmarks] = useDataStore((store) => [store.ilinks, store.bookmarks], shallow)
  const lastOpened = useRecentsStore((store) => store.lastOpened)
  const { goTo } = useRouting()
  const { getNamespaceOfNodeid } = useNamespaces()

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
        <CardsContainer view={ViewType.Card}>
          {allLinks &&
            allLinks.map((s) => {
              const icon = useMetadataStore.getState().metadata.notes?.[s.nodeid]?.icon
              const namespace = getNamespaceOfNodeid(s.nodeid)

              return (
                <Result onClick={() => onOpen(s.nodeid)} view={ViewType.Card} key={`tag_res_prev_${s.nodeid}`}>
                  <ResultHeader>
                    <Group>
                      <IconDisplay icon={icon} size={20} />
                      <ResultTitle>{s?.path}</ResultTitle>
                    </Group>
                    <NamespaceTag namespace={namespace} />
                  </ResultHeader>
                  <SearchPreviewWrapper>
                    <EditorPreviewRenderer
                      content={contents[s.nodeid] ? contents[s.nodeid].content : defaultContent.content}
                      editorId={`editor_preview_${s.nodeid}`}
                    />
                  </SearchPreviewWrapper>
                </Result>
              )
            })}
        </CardsContainer>
      </Content>
    </PageContainer>
  )
}

export default DraftView
