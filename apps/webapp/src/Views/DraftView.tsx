import { useEffect, useMemo, useRef, useState } from 'react'

import { uniq } from 'lodash'
import { nanoid } from 'nanoid'
import styled, { css } from 'styled-components'
import shallow from 'zustand/shallow'

import { Button } from '@workduck-io/mex-components'

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
  userPreferenceStore as useUserPreferenceStore,
  useSnippetStore,
  ViewType
} from '@mexit/core'
import {
  centeredCss,
  DefaultMIcons,
  getMIcon,
  Group,
  IconDisplay,
  MainHeader,
  PageContainer,
  Result,
  ResultCardFooter,
  ResultHeader,
  Results,
  ResultTitle,
  SearchPreviewWrapper,
  size,
  Title
} from '@mexit/shared'

import Plateless from '../Components/Editor/Plateless'
import { TagsRelatedTiny } from '../Components/Editor/TagsRelated'
import HomepageSearchbar from '../Components/HomepageSearchbar/HomepageSearchbar'
import LinkComponent from '../Components/Link'
import NamespaceTag from '../Components/NamespaceTag'
import EditorPreviewRenderer from '../Editor/EditorPreviewRenderer'
import { useNamespaces } from '../Hooks/useNamespaces'
import { useNavigation } from '../Hooks/useNavigation'
import { NavigationType, ROUTE_PATHS, useRouting } from '../Hooks/useRouting'
import { useSnippets } from '../Hooks/useSnippets'
import { useTags } from '../Hooks/useTags'
import { useURLFilters } from '../Hooks/useURLs'

interface SearchViewState<Item> {
  selected: number
  searchTerm: string
  result: Item[]
}

const CardsContainerParent = styled.div`
  display: flex;
  max-width: calc(100vw - 14rem);
  position: relative;
  margin: 0 2rem 2rem;

  @media (max-width: ${size.tiny}) {
    margin: 0 1rem;
    margin-bottom: 2rem;
  }
`

const CardsContainer = styled(Results)<{ SearchContainer?: boolean }>`
  ${({ SearchContainer }) =>
    SearchContainer &&
    css`
      flex-wrap: wrap;
    `};
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

const CarouselButton = styled(Button)`
  top: 50%;
  color: ${({ theme }) => theme.tokens.text.fade};

  ${centeredCss}

  cursor: pointer;
  position: absolute;
  z-index: 1;
  text-align: center;
  border-radius: 50%;
  /* transform: translateY(-50%);
  transition: transform 0.1s linear; */
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

const CarouselButtons = ({ onRightClick, onLeftClick, isLeftHidden, isRightHidden }) => {
  return (
    <>
      <LeftButton onClick={onLeftClick} hidden={isLeftHidden}>
        <IconDisplay icon={getMIcon('ICON', 'fe:arrow-left')} />
      </LeftButton>
      <RightButton onClick={onRightClick} hidden={isRightHidden}>
        <IconDisplay icon={getMIcon('ICON', 'fe:arrow-right')} />
      </RightButton>
    </>
  )
}

function DraftView<Item>() {
  const [ilinks, bookmarks] = useDataStore((store) => [store.ilinks, store.bookmarks], shallow)
  const lastOpened = useRecentsStore((store) => store.lastOpened)
  const { hasTags } = useTags()
  const { goTo } = useRouting()
  const { push } = useNavigation()
  const { getNamespaceOfNodeid } = useNamespaces()
  const { getSnippet } = useSnippets()
  const _hasSnippetsHydrated = useSnippetStore((store) => store._hasHydrated)
  const links = useLinkStore((store) => store.links)
  const contents = useContentStore((store) => store.contents)
  const [activityNotes, setActivityNotes] = useState<ILink[]>()
  const [activitySnippets, setActivitySnippets] = useState<Snippet[]>()
  const [searchresultCards, setSearchresultCards] = useState({
    notes: [],
    snippets: []
  })
  const { addTagFilter } = useURLFilters()
  const addRecent = useRecentsStore((store) => store.addRecent)
  const getHighlightsOfUrl = useHighlightStore((store) => store.getHighlightsOfUrl)
  const setpreferenceModifiedAtAndLastOpened = useUserPreferenceStore(
    (store) => store.setpreferenceModifiedAtAndLastOpened
  )
  const allSnippets = useSnippetStore((store) => store.snippets)

  // for search
  const [showrecents, setShowrecents] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const [searchState, setSS] = useState<SearchViewState<Item>>({
    selected: -1,
    searchTerm: '',
    result: []
  })

  const { result, searchTerm, selected } = searchState

  const findLatestHighlightTime = (linkurl: string) => {
    const highlightsforaLink = getHighlightsOfUrl(linkurl)

    if (highlightsforaLink) {
      highlightsforaLink.sort((a, b) => {
        return b.createdAt - a.createdAt
      })
      return highlightsforaLink[0]?.createdAt ?? 0
    }
  }
  const initialLinks = useMemo(() => {
    return links?.sort(sortByCreated)
  }, [links])

  const highlightsUpdater = useMemo(() => {
    let lastOpenedHighlightTime = 0
    lastOpenedHighlightTime = lastOpened?.highlight?.length > 0 ? findLatestHighlightTime(lastOpened?.highlight[0]) : 0

    if (initialLinks?.length > 0) {
      initialLinks.forEach((link) => {
        const highlightsfortheLink = getHighlightsOfUrl(link.url)
        const latestHighlightsFirst = highlightsfortheLink.sort((a, b) => {
          return b.createdAt - a.createdAt
        })

        const latestHighlightTime = latestHighlightsFirst[0]?.createdAt

        if (latestHighlightTime > lastOpenedHighlightTime) {
          addRecent(RecentType.highlight, link.url)
          setpreferenceModifiedAtAndLastOpened(Date.now(), useRecentsStore.getState().lastOpened)
          lastOpenedHighlightTime = latestHighlightTime
        }
      })
    }
  }, [links])

  useEffect(() => {
    if (ilinks && ilinks?.length > 0) {
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

    if (lastOpened?.snippet && lastOpened?.snippet?.length > 0) {
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
  }, [ilinks, bookmarks, lastOpened, _hasSnippetsHydrated, allSnippets, showrecents])

  useEffect(() => {
    if (result && result?.length > 0) {
      const validSearchCards = {
        notes: [],
        snippets: []
      }

      result.forEach((element: any) => {
        if (element?.parent.startsWith('NODE')) {
          const ilink = ilinks.find((store) => store.nodeid === element?.parent)
          if (ilink) validSearchCards.notes.push(ilink)
        } else {
          const snippet = getSnippet(element?.parent)
          if (snippet) validSearchCards.snippets.push(snippet)
        }
      })

      setSearchresultCards((prevState) => ({
        ...prevState,
        notes: validSearchCards.notes,
        snippets: validSearchCards.snippets
      }))
    }
  }, [result])

  const onOpen = (id: string) => {
    push(id)
    addRecent(RecentType.notes, id)
    setpreferenceModifiedAtAndLastOpened(Date.now(), useRecentsStore.getState().lastOpened)
    goTo(ROUTE_PATHS.editor, NavigationType.push, id)
  }

  const descriptions = useDescriptionStore((store) => store.descriptions)
  const randId = useMemo(() => nanoid(), [])
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const onOpenSnippet = (s: Snippet) => {
    addRecent(RecentType.snippet, s?.id)
    setpreferenceModifiedAtAndLastOpened(Date.now(), useRecentsStore.getState().lastOpened)
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
        <Title>Welcome to Mexit !</Title>
      </MainHeader>
      <MainHeader>
        <p>All your latest activities will be shown here.</p>
      </MainHeader>

      <HomepageSearchbar
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        setShowrecents={setShowrecents}
        isHomepage={true}
        searchState={searchState}
        setSS={setSS}
      />

      {showrecents &&
        lastOpened?.notes?.length === 0 &&
        lastOpened?.snippet?.length === 0 &&
        lastOpened?.highlight?.length === 0 && <Info>No Activity Found</Info>}

      {/* Notes Section (results/recents) */}
      <>
        {((showrecents && lastOpened?.notes?.length > 0) || (!showrecents && searchresultCards?.notes?.length > 0)) && (
          <MainHeader>
            <ActivityTitle>{showrecents ? 'Recent' : 'Result'} Notes</ActivityTitle>
          </MainHeader>
        )}

        {showrecents
          ? lastOpened &&
            activityNotes &&
            lastOpened?.notes?.length > 0 && (
              <CardsContainerParent>
                {((window.innerWidth > parseInt(size.tiny) && lastOpened?.notes?.length >= 3) ||
                  (window.innerWidth <= parseInt(size.tiny) && lastOpened?.notes?.length > 1)) && (
                  <CarouselButtons
                    onLeftClick={scrollToLeft}
                    onRightClick={scrollToRight}
                    isLeftHidden={isLeftHidden}
                    isRightHidden={isRightHidden}
                  />
                )}

                <CardsContainer view={ViewType.Card} ref={containerRef}>
                  {activityNotes.map((s) => {
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
                            noMouseEvents
                          />
                        </SearchPreviewWrapper>
                      </Result>
                    )
                  })}
                </CardsContainer>
              </CardsContainerParent>
            )
          : searchresultCards &&
            searchresultCards?.notes?.length > 0 && (
              <CardsContainerParent>
                {((window.innerWidth > parseInt(size.tiny) && searchresultCards?.notes?.length >= 3) ||
                  (window.innerWidth <= parseInt(size.tiny) && searchresultCards?.notes?.length > 1)) && (
                  <CarouselButtons
                    onLeftClick={scrollToLeft}
                    onRightClick={scrollToRight}
                    isLeftHidden={isLeftHidden}
                    isRightHidden={isRightHidden}
                  />
                )}

                <CardsContainer view={ViewType.Card} ref={containerRef}>
                  {searchresultCards.notes?.map((element: any) => {
                    const nodeid = element?.nodeid
                    const title = element?.path
                    const id = element?.nodeid

                    const icon = useMetadataStore.getState().metadata.notes?.[nodeid]?.icon
                    const namespace = getNamespaceOfNodeid(nodeid)

                    const edNode = { ...element, title: title, id: nodeid }
                    const isTagged = hasTags(edNode?.nodeid)

                    const con = contents[nodeid]
                    const content = con ? con.content : defaultContent.content

                    const resultKey = `tag_res_prev_${nodeid}`

                    return (
                      <Result
                        onClick={() => {
                          onOpen(element?.nodeid)
                        }}
                        view={ViewType.Card}
                        recents={true}
                        key={resultKey}
                        id={nodeid}
                      >
                        <ResultHeader active>
                          <Group>
                            {icon && <IconDisplay icon={icon} size={20} />}
                            <ResultTitle>{title}</ResultTitle>
                          </Group>
                          {namespace && <NamespaceTag namespace={namespace} />}
                        </ResultHeader>

                        <SearchPreviewWrapper>
                          <EditorPreviewRenderer content={content} editorId={`editor_${nodeid}`} noMouseEvents />
                        </SearchPreviewWrapper>

                        {isTagged && (
                          <ResultCardFooter>
                            <TagsRelatedTiny nodeid={edNode.nodeid} />
                          </ResultCardFooter>
                        )}
                      </Result>
                    )
                  })}
                </CardsContainer>
              </CardsContainerParent>
            )}
      </>

      {/* //* Snippets Section (results/recents) */}

      <>
        {((showrecents && lastOpened?.snippet?.length > 0) ||
          (!showrecents && searchresultCards?.snippets?.length > 0)) && (
          <MainHeader>
            <ActivityTitle>{showrecents ? 'Recent' : 'Result'} Snippets</ActivityTitle>
          </MainHeader>
        )}

        {showrecents
          ? lastOpened &&
            activitySnippets &&
            lastOpened?.snippet?.length > 0 && (
              <CardsContainerParent>
                {((window.innerWidth > parseInt(size.tiny) && lastOpened?.snippet?.length >= 3) ||
                  (window.innerWidth <= parseInt(size.tiny) && lastOpened?.snippet?.length > 1)) && (
                  <CarouselButtons
                    onLeftClick={scrollToLeft2}
                    onRightClick={scrollToRight2}
                    isLeftHidden={isLeftHidden2}
                    isRightHidden={isRightHidden2}
                  />
                )}

                <CardsContainer view={ViewType.Card} ref={containerRef2}>
                  {activitySnippets.map((s) => {
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
            )
          : searchresultCards &&
            searchresultCards?.snippets?.length > 0 && (
              <CardsContainerParent>
                {((window.innerWidth > parseInt(size.tiny) && searchresultCards?.snippets?.length >= 3) ||
                  (window.innerWidth <= parseInt(size.tiny) && searchresultCards?.snippets?.length > 1)) && (
                  <CarouselButtons
                    onLeftClick={scrollToLeft2}
                    onRightClick={scrollToRight2}
                    isLeftHidden={isLeftHidden2}
                    isRightHidden={isRightHidden2}
                  />
                )}

                <CardsContainer view={ViewType.Card} ref={containerRef2}>
                  {searchresultCards?.snippets?.map((s) => {
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
                        <ResultHeader $paddingSize="small" active>
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
            )}
      </>

      {showrecents && lastOpened?.highlight && lastOpened?.highlight?.length > 0 && (
        <>
          <MainHeader>
            <ActivityTitle>Recent Captures</ActivityTitle>
          </MainHeader>
          <CardsContainerParent>
            {((window.innerWidth > parseInt(size.tiny) && lastOpened?.highlight?.length >= 3) ||
              (window.innerWidth <= parseInt(size.tiny) && lastOpened?.highlight?.length > 1)) && (
              <CarouselButtons
                onLeftClick={scrollToLeft3}
                onRightClick={scrollToRight3}
                isLeftHidden={isLeftHidden3}
                isRightHidden={isRightHidden3}
              />
            )}

            <CardsContainer view={ViewType.Card} ref={containerRef3}>
              {lastOpened?.highlight &&
                lastOpened?.highlight?.map((linkurl) => {
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
