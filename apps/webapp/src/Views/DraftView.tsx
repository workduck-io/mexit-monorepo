import { useEffect, useMemo, useRef, useState } from 'react'

import { uniq } from 'lodash'
import { nanoid } from 'nanoid'
import styled from 'styled-components'
import shallow from 'zustand/shallow'

import {
  defaultContent,
  ILink,
  RecentType,
  Snippet,
  sortByCreated,
  useContentStore,
  useDataStore,
  useDescriptionStore,
  useHighlightStore,
  useLinkStore,
  useMetadataStore,
  useRecentsStore,
  useSnippetStore,
  ViewType
} from '@mexit/core'
import {
  DefaultMIcons,
  Group,
  IconDisplay,
  MainHeader,
  PageContainer,
  Result,
  ResultHeader,
  Results,
  ResultTitle,
  SearchPreviewWrapper,
  size,
  Title
} from '@mexit/shared'

import Plateless from '../Components/Editor/Plateless'
import LinkComponent from '../Components/Link'
import NamespaceTag from '../Components/NamespaceTag'
import EditorPreviewRenderer from '../Editor/EditorPreviewRenderer'
import { useNamespaces } from '../Hooks/useNamespaces'
import { useNavigation } from '../Hooks/useNavigation'
import { NavigationType, ROUTE_PATHS, useRouting } from '../Hooks/useRouting'
import { useSnippets } from '../Hooks/useSnippets'
import { useURLFilters } from '../Hooks/useURLs'

const CardsContainerParent = styled.div`
  display: flex;
  max-width: 85vw;
  position: relative;
  margin: 0 2rem;
  margin-bottom: 2rem;

  @media (max-width: ${size.tiny}) {
    margin: 0 1rem;
    margin-bottom: 2rem;
  }
`

const CardsContainer = styled(Results)`
  margin: ${({ theme }) => theme.spacing.large} 0 0;
  display: flex;
  overflow-x: hidden;
  scroll-behavior: smooth;
`

const Info = styled.span`
  color: ${({ theme }) => theme.tokens.text.fade};
  font-size: larger;
  font-weight: 700;
  line-height: 1.2;
  margin-left: 2rem;
`

const CarouselButton = styled.button`
  top: 50%;
  height: 44px;
  width: 44px;
  color: #343f4f;
  cursor: pointer;
  font-size: 1.15rem;
  position: absolute;
  z-index: 1;
  text-align: center;
  line-height: 44px;
  background: #fff;
  border-radius: 50%;
  transform: translateY(-50%);
  transition: transform 0.1s linear;
`

const LeftButton = styled(CarouselButton)`
  left: -22px;
`

const RightButton = styled(CarouselButton)`
  right: -22px;

  @media (max-width: ${size.tiny}) {
    right: 80px;
  }

  @media (min-width: ${size.tiny}) and (max-width: ${size.medium}) {
    right: 40px;
  }
`

const ActivityTitle = styled.h2`
  font-size: 1.7rem;
  font-weight: bold;
  -webkit-box-flex: 1;
  flex-grow: 1;
  margin-top: 1rem;
  margin-bottom: 0rem;
`

function useScrollButtons() {
  const containerRef = useRef(null)
  const [isLeftHidden, setIsLeftHidden] = useState(true)
  const [isRightHidden, setIsRightHidden] = useState(false)

  const handleScroll = () => {
    const container = containerRef.current
    if (container) {
      const scrollLeft = container.scrollLeft
      const containerWidth = container.clientWidth
      const scrollWidth = container.scrollWidth
      setIsLeftHidden(scrollLeft <= 0)
      setIsRightHidden(scrollLeft + containerWidth >= scrollWidth)
    }
  }

  const scrollToLeft = () => {
    const container = containerRef.current
    if (container) {
      container.scrollBy({
        left: -470,
        behavior: 'smooth'
      })
    }
  }

  const scrollToRight = () => {
    const container = containerRef.current
    if (container) {
      container.scrollBy({
        left: 470,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [scrollToRight, scrollToLeft])

  return { containerRef, isLeftHidden, isRightHidden, scrollToLeft, scrollToRight }
}

function DraftView() {
  const contents = useContentStore((s) => s.contents)
  const [ilinks, bookmarks] = useDataStore((store) => [store.ilinks, store.bookmarks], shallow)
  const lastOpened = useRecentsStore((store) => store.lastOpened)
  const { goTo } = useRouting()
  const { push } = useNavigation()
  const { getNamespaceOfNodeid } = useNamespaces()
  const { getSnippet } = useSnippets()
  const _hasSnippetsHydrated = useSnippetStore((store) => store._hasHydrated)
  const links = useLinkStore((store) => store.links)
  const [activityNotes, setActivityNotes] = useState<ILink[]>()
  const [activitySnippets, setActivitySnippets] = useState<Snippet[]>()
  const { addTagFilter } = useURLFilters()
  const addRecent = useRecentsStore((store) => store.addRecent)
  const getHighlightsOfUrl = useHighlightStore((store) => store.getHighlightsOfUrl)

  const findLatestHighlightTime = (linkurl: string) => {
    const highlightsforaLink = getHighlightsOfUrl(linkurl)
    highlightsforaLink.sort((a, b) => {
      return b.createdAt - a.createdAt
    })
    return highlightsforaLink[0]?.createdAt ?? 0
  }
  const initialLinks = useMemo(() => {
    return links.sort(sortByCreated)
  }, [links])

  const highlightsUpdater = useMemo(() => {
    let lastOpenedHighlightTime = 0
    lastOpenedHighlightTime = lastOpened?.highlight?.length > 0 ? findLatestHighlightTime(lastOpened?.highlight[0]) : 0

    if (initialLinks.length > 0) {
      initialLinks.forEach((link) => {
        const highlightsfortheLink = getHighlightsOfUrl(link.url)
        const latestHighlightsFirst = highlightsfortheLink.sort((a, b) => {
          return b.createdAt - a.createdAt
        })

        const latestHighlightTime = latestHighlightsFirst[0]?.createdAt

        if (latestHighlightTime > lastOpenedHighlightTime) {
          addRecent(RecentType.highlight, link.url)
          lastOpenedHighlightTime = latestHighlightTime
        }
      })
    }
  }, [links])

  useEffect(() => {
    if (ilinks && ilinks.length > 0) {
      const validNotes = []
      const uniqueNotes = uniq([...bookmarks, ...(lastOpened?.notes ?? [])])
      uniqueNotes.forEach((id) => {
        const ilink = ilinks.find((store) => store.nodeid === id)
        if (ilink) {
          validNotes.push(ilink)
        }
      })

      setActivityNotes(validNotes.reverse())
    }

    if (lastOpened?.snippet && lastOpened?.snippet.length > 0) {
      const validSnippets = []
      const uniqueSnippets = uniq([...bookmarks, ...(lastOpened?.snippet ?? [])])

      if (_hasSnippetsHydrated) {
        uniqueSnippets.forEach((id) => {
          const snippet = getSnippet(id)
          if (snippet) {
            validSnippets.push(snippet)
          }
        })
        setActivitySnippets(validSnippets.reverse())
      }
    }
  }, [ilinks, bookmarks, lastOpened, _hasSnippetsHydrated])

  const onOpen = (id: string) => {
    push(id)
    goTo(ROUTE_PATHS.editor, NavigationType.push, id)
  }

  const descriptions = useDescriptionStore((store) => store.descriptions)
  const randId = useMemo(() => nanoid(), [])
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const onOpenSnippet = (s: Snippet) => {
    push(s?.id)
    loadSnippet(s?.id)
    goTo(ROUTE_PATHS.snippet, NavigationType.push, s?.id, { title: s?.title })
  }

  const { containerRef, isLeftHidden, isRightHidden, scrollToLeft, scrollToRight } = useScrollButtons()

  const {
    containerRef: containerRef2,
    isLeftHidden: isLeftHidden2,
    isRightHidden: isRightHidden2,
    scrollToLeft: scrollToLeft2,
    scrollToRight: scrollToRight2
  } = useScrollButtons()

  const {
    containerRef: containerRef3,
    isLeftHidden: isLeftHidden3,
    isRightHidden: isRightHidden3,
    scrollToLeft: scrollToLeft3,
    scrollToRight: scrollToRight3
  } = useScrollButtons()

  return (
    <PageContainer>
      <MainHeader>
        <Title>Mex Activity!</Title>
      </MainHeader>

      {lastOpened?.notes.length === 0 && lastOpened?.snippet.length === 0 && lastOpened?.highlight.length === 0 && (
        <Info>No Activity Found</Info>
      )}

      {lastOpened?.notes && lastOpened?.notes.length > 0 && (
        <>
          <MainHeader>
            <ActivityTitle>Recent Notes</ActivityTitle>
          </MainHeader>

          <CardsContainerParent>
            {((window.innerWidth > parseInt(size.tiny) && lastOpened?.notes.length >= 3) ||
              (window.innerWidth <= parseInt(size.tiny) && lastOpened?.notes.length > 1)) && (
              <>
                <LeftButton onClick={scrollToLeft} hidden={isLeftHidden}>
                  &lt;
                </LeftButton>
                <RightButton onClick={scrollToRight} hidden={isRightHidden}>
                  &gt;
                </RightButton>
              </>
            )}

            <CardsContainer view={ViewType.Card} ref={containerRef}>
              {activityNotes &&
                activityNotes.map((s) => {
                  const icon = useMetadataStore.getState().metadata.notes?.[s.nodeid]?.icon
                  const namespace = getNamespaceOfNodeid(s.nodeid)

                  return (
                    <Result
                      onClick={() => onOpen(s.nodeid)}
                      view={ViewType.Card}
                      recents={true}
                      key={`tag_res_prev_${s.nodeid}`}
                    >
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
          </CardsContainerParent>
        </>
      )}

      {lastOpened?.snippet && lastOpened?.snippet.length > 0 && (
        <>
          <MainHeader>
            <ActivityTitle>Recent Snippets</ActivityTitle>
          </MainHeader>

          <CardsContainerParent>
            {((window.innerWidth > parseInt(size.tiny) && lastOpened?.snippet.length >= 3) ||
              (window.innerWidth <= parseInt(size.tiny) && lastOpened?.snippet.length > 1)) && (
              <>
                <LeftButton onClick={scrollToLeft2} hidden={isLeftHidden2}>
                  &lt;
                </LeftButton>
                <RightButton onClick={scrollToRight2} hidden={isRightHidden2}>
                  &gt;
                </RightButton>
              </>
            )}
            <CardsContainer view={ViewType.Card} ref={containerRef2}>
              {activitySnippets &&
                activitySnippets.map((s) => {
                  const id = `${s?.id}_ResultFor_SearchSnippet_${randId}`
                  return (
                    <Result
                      view={ViewType.Card}
                      key={id}
                      onClick={() => {
                        onOpenSnippet(s)
                      }}
                      recents={true}
                    >
                      <ResultHeader $paddingSize="small">
                        <Group>
                          <IconDisplay icon={DefaultMIcons.SNIPPET} size={20} />
                          <ResultTitle>{s?.title}</ResultTitle>
                        </Group>
                      </ResultHeader>
                      <SearchPreviewWrapper padding>
                        <Plateless content={descriptions?.[s?.id]?.truncatedContent} multiline />
                      </SearchPreviewWrapper>
                    </Result>
                  )
                })}
            </CardsContainer>
          </CardsContainerParent>
        </>
      )}

      {lastOpened?.highlight && lastOpened?.highlight.length > 0 && (
        <>
          <MainHeader>
            <ActivityTitle>Recent Captures</ActivityTitle>
          </MainHeader>
          <CardsContainerParent>
            {((window.innerWidth > parseInt(size.tiny) && lastOpened?.highlight.length >= 3) ||
              (window.innerWidth <= parseInt(size.tiny) && lastOpened?.highlight.length > 1)) && (
              <>
                <LeftButton onClick={scrollToLeft3} hidden={isLeftHidden3}>
                  &lt;
                </LeftButton>
                <RightButton onClick={scrollToRight3} hidden={isRightHidden3}>
                  &gt;
                </RightButton>
              </>
            )}

            <CardsContainer view={ViewType.Card} ref={containerRef3}>
              {lastOpened?.highlight &&
                lastOpened?.highlight.map((linkurl) => {
                  const link = links?.find((s) => s.url === linkurl)
                  if (!linkurl || !link) {
                    return null
                  }
                  const id = `${linkurl}_ResultFor_SearchLinks`

                  return (
                    <>
                      <Result view={ViewType.Card} key={id} recents={true}>
                        <LinkComponent addTagFilter={addTagFilter} link={link} />
                      </Result>
                    </>
                  )
                })}
            </CardsContainer>
          </CardsContainerParent>
        </>
      )}
    </PageContainer>
  )
}

export default DraftView
