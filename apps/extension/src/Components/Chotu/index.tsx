import React, { createRef, useRef, useState } from 'react'
import { useAuthStore } from '../../Hooks/useAuth'
import { useShortenerStore } from '../../Hooks/useShortener'
import {
  ActionType,
  CategoryType,
  Contents,
  CREATE_NEW_ITEM,
  defaultActions,
  initActions,
  isReservedOrClash,
  LinkCapture,
  MexitAction,
  MEXIT_FRONTEND_URL_BASE,
  mog,
  searchBrowserAction,
  Snippet,
  UserDetails,
  WorkspaceDetails
} from '@mexit/core'
import { useEffect } from 'react'
import { Container, CopyButton, Icon, StyledChotu } from './styled'
import useThemeStore from '../../Hooks/useThemeStore'
import useInternalAuthStore from '../../Hooks/useAuthStore'
import { Notification, Theme } from '@mexit/shared'
import { Search, useSputlitContext, VisualState } from '../../Hooks/useSputlitContext'
import toast from 'react-hot-toast'
import { AsyncMethodReturns, connectToChild } from 'penpal'
import fuzzysort from 'fuzzysort'
import { getListItemFromNode, getListItemFromSnippet } from '../../Utils/helper'
import { useSnippets } from '../../Hooks/useSnippets'
import { useQuickLinks } from '../../Hooks/useQuickLinks'
import { useSnippetStore, useContentStore, useDataStore } from '@workduck-io/mex-editor'
import ShortCutLinks from '../ShortCutLinks'

export default function Chotu() {
  const iframeRef = createRef<HTMLIFrameElement>()
  const linkCaptures = useShortenerStore((store) => store.linkCaptures)
  const setLinkCaptures = useShortenerStore((store) => store.setLinkCaptures)
  const addLinkCapture = useShortenerStore((store) => store.addLinkCapture)
  const setTheme = useThemeStore((store) => store.setTheme)
  const getSnippet = useSnippets().getSnippet

  const setAutheticated = useAuthStore((store) => store.setAuthenticated)
  const setInternalAuthStore = useInternalAuthStore((store) => store.setAllStore)
  const initSnippets = useSnippetStore((store) => store.initSnippets)
  const { setSearchResults, search, activeItem } = useSputlitContext()
  const initContents = useContentStore((store) => store.initContents)
  const { ilinks, setIlinks } = useDataStore()
  const { getQuickLinks } = useQuickLinks()

  const [child, setChild] = useState<AsyncMethodReturns<any>>(null)

  useEffect(() => {
    const connection = connectToChild({
      iframe: iframeRef.current,
      methods: {
        init(
          userDetails: UserDetails,
          workspaceDetails: WorkspaceDetails,
          linkCaptures: LinkCapture[],
          theme: Theme,
          authAWS: any,
          snippets: Snippet[],
          contents: Contents,
          ilinks: any[]
        ) {
          // Can be separated into multiple methods
          setAutheticated(userDetails, workspaceDetails)
          setLinkCaptures(linkCaptures)
          setTheme(theme)
          setInternalAuthStore(authAWS)
          initSnippets(snippets)
          setIlinks(ilinks)
          initContents(contents)
        },
        success(message: string) {
          toast.success(message)
        },
        error(message: string) {
          toast.error(message)
        }
      }
      // debug: true
    })

    connection.promise
      .then((child: any) => {
        setChild(child)
      })
      .catch((error) => {
        console.error(error)
      })

    return () => {
      connection.destroy()
      setChild(null)
    }
  }, [])

  useEffect(() => {
    const useSearch = async (search: Search) => {
      let searchList = []
      const quickLinks = getQuickLinks()

      switch (search.type) {
        case CategoryType.action:
          const actionList = fuzzysort
            .go(search.value.substring(1), initActions, { all: true, key: 'title' })
            .map((item) => item.obj)
          searchList = actionList
          break
        case CategoryType.backlink:
          if (search.value.substring(2)) {
            const results = fuzzysort
              .go(search.value.substring(2), quickLinks, { all: true, key: 'title' })
              .map((item) => item.obj)

            const isNew = !isReservedOrClash(
              search.value.substring(2),
              quickLinks.map((i) => i.title)
            )

            searchList = isNew ? [CREATE_NEW_ITEM, ...results] : results
          }
          break
        case CategoryType.search:
          const snippetItems = await child.search('snippet', search.value)
          const nodeItems = await child.search('node', search.value)

          const actionItems = fuzzysort
            .go(search.value, initActions, { all: true, key: 'title' })
            .map((item) => item.obj)

          const localNodes = []

          nodeItems.forEach((item) => {
            const node = ilinks.find((i) => i.nodeid === item.id)
            const listItem = getListItemFromNode(node, item.text, item.blockId)
            localNodes.push(listItem)
          })

          snippetItems.forEach((snippet: Snippet) => {
            const snip = getSnippet(snippet.id)
            const item = getListItemFromSnippet(snip)
            localNodes.push(item)
          })

          const mainItems = [...localNodes, ...actionItems]

          const isNew = !isReservedOrClash(
            search.value,
            quickLinks.map((i) => i.title)
          )

          searchList = isNew ? [CREATE_NEW_ITEM, ...mainItems] : mainItems
          // search debug
          // mog('nodelist', { nodeItems, snippetItems })
          // mog('searchList chotu', { searchList })
          if (mainItems.length === 0) searchList.push(searchBrowserAction(search.value))
          break
      }

      setSearchResults(searchList)
    }

    if (child) {
      if (activeItem && activeItem?.type === ActionType.SEARCH) {
        setSearchResults([searchBrowserAction(search.value, activeItem)])
      } else if (!activeItem) {
        useSearch(search)
      }
    }
  }, [child, activeItem, search.value, ilinks])

  return (
    // TODO: Test this whenever shornter starts working
    <StyledChotu show={linkCaptures.some((item) => item.long === window.location.href)}>
      <iframe ref={iframeRef} src={`${MEXIT_FRONTEND_URL_BASE}/chotu`} id="chotu-iframe" />
      <Icon>{/* <img src={chrome.runtime.getURL('/Assets/black_logo.svg')} /> */}</Icon>

      <Container>
        <p>shortened</p>
        <CopyButton>{/* <img src={chrome.runtime.getURL('/Assets/copy.svg')} /> */}</CopyButton>
      </Container>

      <Notification />
    </StyledChotu>
  )
}
