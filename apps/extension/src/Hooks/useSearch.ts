/* eslint-disable no-case-declarations */
import fuzzysort from 'fuzzysort'

import {
  CategoryType,
  isReservedOrClash,
  CREATE_NEW_ITEM,
  initActions,
  ListItemType,
  sortByCreated,
  fuzzySearchLinks,
  getListItemFromLink,
  mog,
  ActionType,
  QuickLinkType
} from '@mexit/core'

import useDataStore from '../Stores/useDataStore'
import { useLinkStore } from '../Stores/useLinkStore'
import { useSputlitStore } from '../Stores/useSputlitStore'
import { getListItemFromNode, getListItemFromSnippet } from '../Utils/helper'
import { useAuthStore } from './useAuth'
import { useQuickLinks } from './useQuickLinks'
import useRaju from './useRaju'
import { useSnippets } from './useSnippets'

export const useSearch = () => {
  const { dispatch } = useRaju()
  const { getQuickLinks } = useQuickLinks()
  const { getSnippet } = useSnippets()
  const ilinks = useDataStore((state) => state.ilinks)
  const links = useLinkStore((state) => state.links)

  const searchInList = async (actionType?: ActionType) => {
    let searchList: Array<ListItemType> = []
    const quickLinks = getQuickLinks()

    const search = useSputlitStore.getState().search
    const workspaceID = useAuthStore.getState().workspaceDetails?.id

    switch (search?.type) {
      case CategoryType.backlink:
        const nodeItems = await dispatch('SEARCH', ['node'], search.value)
        const snippetItems = await dispatch('SEARCH', ['snippet', 'template'], search.value)

        const sortedLinks = links.sort(sortByCreated)

        const resultLinks = fuzzySearchLinks(search.value, sortedLinks)
        const localNodes = []

        nodeItems?.forEach((item) => {
          // const localNode = isLocalNode(item.id)

          const node = ilinks.find((i) => i.nodeid === item.id)
          const listItem = getListItemFromNode(node, item.text, item.blockId, actionType)
          localNodes.push(listItem)
        })

        snippetItems?.forEach((snippet) => {
          const snip = getSnippet(snippet.id)
          const item = getListItemFromSnippet(snip, actionType)
          localNodes.push(item)
        })

        resultLinks?.forEach((link) => {
          // mog('Link to convert', { link })
          const item = getListItemFromLink(link, workspaceID)

          localNodes.push(item)
        })

        const isNew =
          !isReservedOrClash(
            search.value,
            quickLinks.map((i) => i.title)
          ) && actionType === ActionType.OPEN

        searchList = isNew ? [CREATE_NEW_ITEM, ...localNodes] : localNodes
        break

      case CategoryType.action:
        const actionItems = fuzzysort.go(search.value, initActions, { key: 'title' }).map((item) => item.obj)

        const useQueryActions = initActions
          .filter((a) => a.type === ActionType.SEARCH)
          .map((i) => ({ ...i, category: QuickLinkType.search }))

        searchList = [...actionItems.slice(0, 5), ...useQueryActions]

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
