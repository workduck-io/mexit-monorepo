/* eslint-disable @typescript-eslint/no-explicit-any */
import { ELEMENT_MENTION } from '@udecode/plate'

import {
  ELEMENT_ILINK,
  ELEMENT_INLINE_BLOCK,
  ELEMENT_TASK_VIEW_BLOCK,
  ELEMENT_TASK_VIEW_LINK,
  idxKey,
  SearchRepExtra
} from '@mexit/core'

import { useAuthStore } from '../Stores/useAuth'
import { useDataStore } from '../Stores/useDataStore'
import { useMentionStore } from '../Stores/useMentionsStore'
import {
  addDoc,
  removeDoc,
  searchIndex,
  searchIndexByNodeId,
  searchIndexWithRanking,
  updateDoc
} from '../Workers/controller'

import { useLinks } from './useLinks'

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
  const { getPathFromNodeid } = useLinks()
  const { getSearchExtra } = useSearchExtra()

  const addDocument = async (
    key: idxKey,
    nodeId: string,
    contents: any[],
    title: string | undefined = undefined,
    tags?: Array<string>
  ) => {
    const extra = getSearchExtra()

    await addDoc(key, nodeId, contents, title ?? getPathFromNodeid(nodeId), tags, extra)
  }

  const updateDocument = async (
    key: idxKey,
    nodeId: string,
    contents: any[],
    title: string | undefined = undefined,
    tags?: Array<string>
  ) => {
    const extra = getSearchExtra()

    await updateDoc(key, nodeId, contents, title ?? getPathFromNodeid(nodeId), tags, extra)
  }

  const removeDocument = async (key: idxKey, id: string) => {
    await removeDoc(key, id)
  }

  const queryIndex = async (key: idxKey | idxKey[], query: string, tags?: Array<string>) => {
    const results = await searchIndex(key, query, tags)
    return results
  }

  const queryIndexByNodeId = async (key: idxKey | idxKey[], nodeId: string, query: string) => {
    const results = await searchIndexByNodeId(key, nodeId, query)
    return results
  }

  const queryIndexWithRanking = async (key: idxKey | idxKey[], query: string) => {
    const results = await searchIndexWithRanking(key, query)
    return results
  }

  return { addDocument, updateDocument, removeDocument, queryIndex, queryIndexByNodeId, queryIndexWithRanking }
}
