import fuzzysort from 'fuzzysort'

import {
  CategoryType,
  mog,
  isReservedOrClash,
  CREATE_NEW_ITEM,
  initActions,
  searchBrowserAction,
  ListItemType
} from '@mexit/core'

import useDataStore from '../Stores/useDataStore'
import { getListItemFromNode, getListItemFromSnippet } from '../Utils/helper'
import { useQuickLinks } from './useQuickLinks'
import useRaju from './useRaju'
import { useSnippets } from './useSnippets'
import { useSputlitContext } from './useSputlitContext'

export const useSearch = () => {
  const { search, setSearchResults } = useSputlitContext()
  const { dispatch } = useRaju()
  const { getQuickLinks } = useQuickLinks()
  const { getSnippet } = useSnippets()
  const ilinks = useDataStore((state) => state.ilinks)

  const searchInList = async () => {
    let searchList: Array<ListItemType> = []
    const quickLinks = getQuickLinks()

    let sQuery: string

    if (search?.type === CategoryType.backlink) sQuery = search?.value.substring(2)
    else sQuery = search?.value

    switch (search?.type) {
      // * Search quick links using [[
      case CategoryType.backlink:
        const query = search.value.substring(2)
        if (query) {
          const results = fuzzysort.go(query, quickLinks, { all: true, key: 'title' }).map((item) => item.obj)

          const isNew = !isReservedOrClash(
            query,
            quickLinks.map((i) => i.title)
          )

          searchList = isNew ? [CREATE_NEW_ITEM, ...results] : results
        } else {
          searchList = quickLinks
        }
        break

      // * Search actions using "/"
      case CategoryType.action:
        const val = search.value.substring(1)
        if (val) {
          const actionList = fuzzysort.go(val, initActions, { all: true, key: 'title' }).map((item) => item.obj)
          searchList = actionList
        } else {
          searchList = initActions
        }
        break

      case CategoryType.search:
        const nodeItems = await dispatch('SEARCH', ['node'], search.value)
        const snippetItems = await dispatch('SEARCH', ['snippet', 'template'], search.value)

        const actionItems = fuzzysort.go(search.value, initActions, { key: 'title' }).map((item) => item.obj)
        const localNodes = []

        nodeItems.forEach((item) => {
          // const localNode = isLocalNode(item.id)

          const node = ilinks.find((i) => i.nodeid === item.id)
          const listItem = getListItemFromNode(node, item.text, item.blockId)
          localNodes.push(listItem)
        })

        snippetItems.forEach((snippet) => {
          const snip = getSnippet(snippet.id)
          const item = getListItemFromSnippet(snip)
          localNodes.push(item)
        })

        const isNew = !isReservedOrClash(
          search.value,
          quickLinks.map((i) => i.title)
        )

        const mainItems = [...localNodes, ...actionItems]
        searchList = isNew ? [CREATE_NEW_ITEM, ...mainItems] : mainItems
        if (mainItems.length === 0) searchList.push(searchBrowserAction(sQuery))

        break

      default:
        break
    }

    return searchList
  }

  return {
    searchInList
  }
}
