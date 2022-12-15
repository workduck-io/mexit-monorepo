/* eslint-disable no-case-declarations */
import fuzzysort from 'fuzzysort'

import {
  ActionType,
  CategoryType,
  CREATE_NEW_ITEM,
  ELEMENT_ILINK,
  ELEMENT_INLINE_BLOCK,
  ELEMENT_MENTION,
  fuzzySearchLinks,
  getListItemFromLink,
  idxKey,
  initActions,
  isReservedOrClash,
  ListItemType,
  QuickLinkType,
  SearchRepExtra,
  sortByCreated
} from '@mexit/core'

import useDataStore from '../Stores/useDataStore'
import { useLinkStore } from '../Stores/useLinkStore'
import { useMentionStore } from '../Stores/useMentionStore'
import { useSputlitStore } from '../Stores/useSputlitStore'
import { wAddDoc, wRemoveDoc, wSearchIndex, wUpdateDoc } from '../Sync/invokeOnWorker'
import { getListItemFromNode, getListItemFromSnippet } from '../Utils/helper'

import { useAuthStore } from './useAuth'
import { useLinks } from './useLinks'
import { useQuickLinks } from './useQuickLinks'
import { useSnippets } from './useSnippets'

export const useSearchExtra = () => {
  const ilinks = useDataStore((s) => s.ilinks)
  const mentionable = useMentionStore((s) => s.mentionable)
  const invited = useMentionStore((s) => s.invitedUsers)
  const currentUserDetails = useAuthStore((s) => s.userDetails)

  const getSearchExtra = (): SearchRepExtra => {
    const ilink_rep = ilinks.reduce((p, ilink) => ({ ...p, [ilink.nodeid]: ilink.path }), {})

    const mention_rep = mentionable.reduce((p, mention) => ({ ...p, [mention.userID]: mention.alias }), {})
    const invited_rep = invited.reduce((p, invited) => ({ ...p, [invited.alias]: invited.alias }), {})
    const self_rep = { ...invited_rep, ...mention_rep, [currentUserDetails?.userID]: currentUserDetails?.alias }

    return {
      [ELEMENT_ILINK]: {
        // ILinks nodeids are in value
        keyToIndex: 'value',
        replacements: ilink_rep
      },
      [ELEMENT_INLINE_BLOCK]: {
        keyToIndex: 'value',
        replacements: ilink_rep
      },
      [ELEMENT_MENTION]: {
        keyToIndex: 'value',
        replacements: self_rep
      }
    }
  }

  return { getSearchExtra }
}

export const useSearch = () => {
  const { getQuickLinks } = useQuickLinks()
  const { getSnippet } = useSnippets()

  const { getSearchExtra } = useSearchExtra()

  const { getPathFromNodeid } = useLinks()

  const searchInList = async (actionType?: ActionType) => {
    const ilinks = useDataStore.getState().ilinks
    const links = useLinkStore.getState().links

    let searchList: Array<ListItemType> = []
    const quickLinks = getQuickLinks()

    const search = useSputlitStore.getState().search
    const selection = useSputlitStore.getState().selection
    const workspaceID = useAuthStore.getState().workspaceDetails?.id

    switch (search?.type) {
      case CategoryType.backlink:
        const nodeItems = await wSearchIndex(['node'], search.value)
        const snippetItems = await wSearchIndex(['snippet', 'template'], search.value)

        const sortedLinks = links.sort(sortByCreated)

        const resultLinks = fuzzySearchLinks(search.value, sortedLinks)
        const localNodes = []

        nodeItems?.forEach((item) => {
          // const localNode = isLocalNode(item.id)
          const node = ilinks.find((i) => i.nodeid === item.id)
          const listItem = getListItemFromNode(node, item.text, item.blockId, actionType)
          localNodes.push(listItem)
        })

        if (!selection) {
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
        }

        const isNew =
          !isReservedOrClash(
            search.value,
            quickLinks.map((i) => i.title)
          ) && actionType !== ActionType.OPEN

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

  const addDocument = async (
    key: idxKey,
    nodeId: string,
    contents: any[],
    title: string | undefined = undefined,
    tags?: Array<string>
  ) => {
    const extra = getSearchExtra()
    await wAddDoc(key, nodeId, contents, title ?? getPathFromNodeid(nodeId), tags, extra)
  }

  const updateDocument = async (
    key: idxKey,
    nodeId: string,
    contents: any[],
    title: string | undefined = undefined,
    tags?: Array<string>
  ) => {
    const extra = getSearchExtra()

    await wUpdateDoc(key, nodeId, contents, title ?? getPathFromNodeid(nodeId), tags, extra)
  }

  const removeDocument = async (key: idxKey, id: string) => {
    await wRemoveDoc(key, id)
  }

  return {
    addDocument,
    searchInList,
    updateDocument,
    removeDocument
  }
}
