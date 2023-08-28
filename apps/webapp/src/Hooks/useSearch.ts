/* eslint-disable @typescript-eslint/no-explicit-any */
import { ELEMENT_MENTION } from '@udecode/plate'

import { Indexes, ISearchQuery, IUpdateDoc } from '@workduck-io/mex-search'

import {
  ELEMENT_ILINK,
  ELEMENT_INLINE_BLOCK,
  ELEMENT_TASK_VIEW_BLOCK,
  ELEMENT_TASK_VIEW_LINK,
  mog,
  MoveBlocksType,
  SearchRepExtra,
  useAuthStore,
  useContentStore,
  useDataStore,
  useMentionStore
} from '@mexit/core'
import { useLinks } from '@mexit/shared'

import {
  addDoc,
  backupSearchIndex,
  moveBlocks,
  removeDoc,
  searchIndex,
  searchIndexByNodeId,
  searchIndexWithRanking,
  updateDoc,
  updateOrAppendBlocks
} from '../Workers/controller'

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
      // TODO: Fix replacements for viewBlock and taskViewLink
      [ELEMENT_TASK_VIEW_LINK]: {
        keyToIndex: 'value',
        replacements: ilink_rep
      },
      [ELEMENT_TASK_VIEW_BLOCK]: {
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
  const { getTitleFromNoteId, getParentILink } = useLinks()
  const { getSearchExtra } = useSearchExtra()
  const documentUpdated = useContentStore((s) => s.setDocUpdated)

  const addDocument = async (doc: IUpdateDoc) => {
    const extra = getSearchExtra()

    await addDoc({
      ...doc,
      title: doc.title ?? getTitleFromNoteId(doc.id, { includeArchived: true, includeShared: true }),
      options: {
        ...(doc.options ?? {}),
        extra
      }
    })
    documentUpdated()
  }

  const backupIndex = async (storeName: string) => {
    const backup = await backupSearchIndex()
    mog('BACKUP', { backup })
    // BackupStorage.putValue(storeName, 'mexit-search-index', backup)
  }

  const updateDocument = async (doc: IUpdateDoc) => {
    const extra = getSearchExtra()

    await updateDoc({
      ...doc,
      title: doc.title ?? getTitleFromNoteId(doc.id, { includeArchived: true, includeShared: true }),
      options: {
        ...(doc.options ?? {}),
        extra
      }
    })

    documentUpdated()
  }

  const updateBlocks = async (doc: IUpdateDoc) => {
    const extra = getSearchExtra()

    await updateOrAppendBlocks({
      ...doc,
      title: doc.title ?? getTitleFromNoteId(doc.id, { includeArchived: true, includeShared: true }),
      options: {
        ...(doc.options ?? {}),
        extra
      }
    })

    documentUpdated()
  }

  const moveBlocksInIndex = async (options: MoveBlocksType) => {
    await moveBlocks(options)
    documentUpdated()
  }

  const removeDocument = async (key: Indexes, id: string) => {
    await removeDoc(key, id)
    documentUpdated()
  }

  const queryIndex = async (key: Indexes, query?: ISearchQuery, tags?: Array<string>) => {
    const results = await searchIndex(key, query)
    return results
  }

  const queryIndexByNodeId = async (key: Indexes, nodeId: string, query: ISearchQuery) => {
    const results = await searchIndexByNodeId(key, nodeId, query)
    return results
  }

  const queryIndexWithRanking = async (key: Indexes, query: ISearchQuery) => {
    const results = await searchIndexWithRanking(key, query)
    return results
  }

  return {
    addDocument,
    updateBlocks,
    moveBlocksInIndex,
    updateDocument,
    backupIndex,
    removeDocument,
    queryIndex,
    queryIndexByNodeId,
    queryIndexWithRanking
  }
}
