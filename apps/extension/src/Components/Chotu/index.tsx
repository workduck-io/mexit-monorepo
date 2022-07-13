import React, { Children, createRef, useRef, useState } from 'react'
import { useAuthStore } from '../../Hooks/useAuth'
import { useShortenerStore } from '../../Hooks/useShortener'
import {
  ActionType,
  CategoryType,
  Contents,
  CREATE_NEW_ITEM,
  defaultActions,
  initActions,
  insertItemInArray,
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
import { ParentMethods } from '../../Hooks/useRaju'
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
import { useSnippetStore } from '../../Stores/useSnippetStore'
import { useContentStore } from '../../Stores/useContentStore'
import useDataStore from '../../Stores/useDataStore'
import useRaju from '../../Hooks/useRaju'
import { useRecentsStore } from '../../Stores/useRecentsStore'
import { ListItemType } from '../../Types/List'
import { useEditorContext } from '../../Hooks/useEditorContext'
import { useMentionStore } from '../../Stores/useMentionsStore'

const MAX_RECENT_ITEMS = 3

export default function Chotu() {
  const iframeRef = createRef<HTMLIFrameElement>()
  const getSnippet = useSnippets().getSnippet

  const { setSearchResults, search, activeItem, selection } = useSputlitContext()
  const previewMode = useEditorContext().previewMode
  const lastOpenedNodes = useRecentsStore((store) => store.lastOpened)
  const { ilinks } = useDataStore()
  const { getQuickLinks } = useQuickLinks()
  const contents = useContentStore((state) => state.contents)
  const methods = useRaju().methods

  const [child, setChild] = useState<AsyncMethodReturns<any>>(null)

  useEffect(() => {
    const connection = connectToChild({
      // debug: true,
      iframe: iframeRef.current,
      methods
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
        case CategoryType.action: {
          const actionList = fuzzysort
            .go(search.value.substring(1), initActions, { all: true, key: 'title' })
            .map((item) => item.obj)
          searchList = actionList
          break
        }

        case CategoryType.backlink: {
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
        }

        case CategoryType.search: {
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
      }

      setSearchResults(searchList)
    }

    if (child) {
      if (activeItem && activeItem?.type === ActionType.SEARCH) {
        setSearchResults([searchBrowserAction(search.value, activeItem)])
      } else if (!activeItem && search.value) {
        useSearch(search)
      } else if (!activeItem && !search.value) {
        if (!previewMode) return

        const recents = lastOpenedNodes
        const items = recents.filter((recent: string) => ilinks.find((ilink) => ilink.nodeid === recent))

        const recentList = items
          .map((nodeid: string) => {
            const item = ilinks.find((link) => link?.nodeid === nodeid)

            const listItem: ListItemType = getListItemFromNode(item)
            return listItem
          })
          .reverse()

        const recentLimit = recentList.length < MAX_RECENT_ITEMS ? recentList.length : MAX_RECENT_ITEMS
        const limitedList = recentList.slice(0, recentLimit)
        const listWithNew = insertItemInArray(limitedList, CREATE_NEW_ITEM, 1)
        const defItems = [CREATE_NEW_ITEM]

        const list = !recentLimit ? defItems : listWithNew

        const data = [...list, ...initActions]

        setSearchResults(data)
      }
    }
  }, [child, activeItem, search.value, ilinks, lastOpenedNodes, contents])

  useEffect(() => {
    const handleEvent = (event: CustomEvent<{ type: keyof ParentMethods }>) => {
      switch (event.detail.type) {
        case 'SET_CONTENT':
          delete event.detail['type']
          child.updateContentStore(event.detail[0])
          break
        case 'ADD_SINGLE_ILINK':
          delete event.detail['type']
          child.updateSingleILink(event.detail[0])
          break
        case 'ADD_MULTIPLE_ILINKS':
          delete event.detail['type']
          child.updateMultipleILinks(event.detail[0])
          break
        case 'ACT_ON_REMINDER':
          delete event.detail['type']
          child.reminderAction(event.detail[0])
          break
      }
    }

    window.addEventListener('raju', handleEvent)

    return () => window.removeEventListener('raju', handleEvent)
  })

  return (
    // TODO: Test this whenever shornter starts working
    <StyledChotu>
      <iframe ref={iframeRef} src={`${MEXIT_FRONTEND_URL_BASE}/chotu`} id="chotu-iframe" />

      <Notification />
    </StyledChotu>
  )
}
