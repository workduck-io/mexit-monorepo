/* eslint-disable no-case-declarations */

import { Indexes, IUpdateDoc } from '@workduck-io/mex-search'

import {
  ActionType,
  CategoryType,
  CREATE_NEW_ITEM,
  CREATE_NEW_SNIPPET,
  ELEMENT_ILINK,
  ELEMENT_INLINE_BLOCK,
  ELEMENT_MENTION,
  fuzzySearch,
  fuzzySearchLinks,
  getListItemFromLink,
  initActions,
  isReservedOrClash,
  ListItemType,
  QuickLinkType,
  SearchRepExtra,
  sortByCreated,
  useAuthStore,
  useContentStore,
  useDataStore,
  useLinkStore,
  useMentionStore
} from '@mexit/core'
import { useQuery } from '@mexit/shared'

import { useSputlitStore } from '../Stores/useSputlitStore'
import { wAddDoc, wRemoveDoc, wSearchIndexWithRanking, wUpdateDoc, wUpdateOrAppendBlocks } from '../Sync/invokeOnWorker'
import { getListItemFromNode, getListItemFromSnippet } from '../Utils/helper'

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

    const mention_rep = mentionable.reduce((p, mention) => ({ ...p, [mention.id]: mention.alias }), {})
    const invited_rep = invited.reduce((p, invited) => ({ ...p, [invited.alias]: invited.alias }), {})
    const self_rep = { ...invited_rep, ...mention_rep, [currentUserDetails?.id]: currentUserDetails?.alias }

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
  const { generateSearchQuery } = useQuery()
  const setDocUpdated = useContentStore((store) => store.setDocUpdated)

  const { getSearchExtra } = useSearchExtra()

  const { getTitleFromNoteId } = useLinks()

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
        const query = generateSearchQuery(search.value)

        const nodeItems = await wSearchIndexWithRanking(Indexes.MAIN, query)
        const snippetItems = await wSearchIndexWithRanking(Indexes.SNIPPET, query)

        const sortedLinks = links.sort(sortByCreated)

        const resultLinks = fuzzySearchLinks(search.value, sortedLinks)
        const localNodes = []

        nodeItems?.forEach((item) => {
          // const localNode = isLocalNode(item.id)
          const node = ilinks.find((i) => i.nodeid === item.parent)
          if (node) {
            const listItem = getListItemFromNode(node, item.text, item.id, actionType)
            localNodes.push(listItem)
          }
        })

        if (!selection) {
          snippetItems?.forEach((snippet) => {
            const snip = getSnippet(snippet.parent)
            if (snip) {
              const item = getListItemFromSnippet(snip, actionType)
              localNodes.push(item)
            }
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

        searchList = isNew ? [CREATE_NEW_ITEM, CREATE_NEW_SNIPPET, ...localNodes] : localNodes
        break

      case CategoryType.action:
        const actionItems = fuzzySearch(initActions, search.value, (item) => item.title)

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

  const addDocument = async (doc: IUpdateDoc) => {
    const extra = getSearchExtra()
    await wAddDoc({
      ...doc,
      title: doc.title ?? getTitleFromNoteId(doc.id, { includeArchived: true, includeShared: true }),
      options: {
        ...(doc.options ?? {}),
        extra
      }
    })

    setDocUpdated()
  }

  const updateBlocks = async (doc: IUpdateDoc) => {
    const extra = getSearchExtra()

    await wUpdateOrAppendBlocks({
      ...doc,
      title: doc.title ?? getTitleFromNoteId(doc.id, { includeArchived: true, includeShared: true }),
      options: {
        ...(doc.options ?? {}),
        extra
      }
    })

    setDocUpdated()
  }

  const updateDocument = async (doc: IUpdateDoc) => {
    const extra = getSearchExtra()

    await wUpdateDoc({
      ...doc,
      title: doc.title ?? getTitleFromNoteId(doc.id, { includeArchived: true, includeShared: true }),
      options: {
        ...(doc.options ?? {}),
        extra
      }
    })

    setDocUpdated()
  }

  const removeDocument = async (key: Indexes, id: string) => {
    await wRemoveDoc(key, id)
    setDocUpdated()
  }

  return {
    addDocument,
    searchInList,
    updateBlocks,
    updateDocument,
    removeDocument
  }
}
