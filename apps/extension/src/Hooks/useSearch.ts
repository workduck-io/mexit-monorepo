/* eslint-disable no-case-declarations */
import fuzzysort from 'fuzzysort'

import {
  CategoryType,
  isReservedOrClash,
  CREATE_NEW_ITEM,
  initActions,
  searchBrowserAction,
  ListItemType,
  sortByCreated,
  fuzzySearchLinks,
  getListItemFromLink
} from '@mexit/core'

import useDataStore from '../Stores/useDataStore'
import { useLinkStore } from '../Stores/useLinkStore'
import { useSputlitStore } from '../Stores/useSputlitStore'
import { getListItemFromNode, getListItemFromSnippet } from '../Utils/helper'
import { useQuickLinks } from './useQuickLinks'
import useRaju from './useRaju'
import { useSnippets } from './useSnippets'

export const useSearch = () => {
  const { dispatch } = useRaju()
  const { getQuickLinks } = useQuickLinks()
  const { getSnippet } = useSnippets()
  const ilinks = useDataStore((state) => state.ilinks)
  const links = useLinkStore((state) => state.links)

  const searchInList = async () => {
    let searchList: Array<ListItemType> = []
    const quickLinks = getQuickLinks()

    const search = useSputlitStore.getState().search

    switch (search?.type) {
      case CategoryType.search:
        const nodeItems = await dispatch('SEARCH', ['node'], search.value)
        const snippetItems = await dispatch('SEARCH', ['snippet', 'template'], search.value)

        const sortedLinks = links.sort(sortByCreated)

        const resultLinks = fuzzySearchLinks(search.value, sortedLinks)
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

        resultLinks.forEach((link) => {
          const item = getListItemFromLink(link)

          localNodes.push(item)
        })

        const isNew = !isReservedOrClash(
          search.value,
          quickLinks.map((i) => i.title)
        )

        const mainItems = [...localNodes, ...actionItems]
        searchList = isNew ? [CREATE_NEW_ITEM, ...mainItems] : mainItems
        if (mainItems.length === 0) searchList.push(searchBrowserAction(search.value))

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
