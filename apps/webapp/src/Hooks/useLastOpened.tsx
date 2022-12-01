import { useCallback } from 'react'

import { getInitialNode, NodeType } from '@mexit/core'
import { LastOpenedData, LastOpenedState } from '@mexit/shared'

import { useUserPreferenceStore } from '../Stores/userPreferenceStore'
import { useLinks } from './useLinks'
import { useNodes } from './useNodes'
import { debounce } from 'lodash'

const DEBOUNCE_TIME = 3000

const INIT_LAST_OPENED = {
  freq: 0,
  ts: 0,
  muted: false
}

export const getLastOpenedState = (updatedAt: number, lastOpenedNote: LastOpenedData): LastOpenedState => {
  // mog('getLastOpenedState', { updatedAt, lastOpenedNote })
  if (lastOpenedNote.muted) {
    return LastOpenedState.MUTED
  } else if (updatedAt > lastOpenedNote.ts) {
    return LastOpenedState.UNREAD
  } else if (updatedAt < lastOpenedNote.ts) {
    return LastOpenedState.OPENED
  } else {
    // Default to unread
    return LastOpenedState.UNREAD
  }
}

/**
 * Hook to update the last opened timestamp of a node
 */
export const useLastOpened = () => {
  const setLastOpenedNotes = useUserPreferenceStore((state) => state.setLastOpenedNotes)
  const { getNodeType, getSharedNode } = useNodes()
  const { getILinkFromNodeid } = useLinks()
  /**
   * Update the last opened timestamp of a node
   * The current timestamp is used as the last opened timestamp
   */
  const addLastOpened = (nodeId: string) => {
    const lastOpenedNotes = useUserPreferenceStore.getState().lastOpenedNotes
    const initNode = getInitialNode()
    if (nodeId === initNode.nodeid) {
      return
    }
    const lastOpenedNote = lastOpenedNotes[nodeId] || { ...INIT_LAST_OPENED }
    // This replaces any previous timestamp with the current timestamp
    const newLastOpenedNotes = {
      ...lastOpenedNotes,
      [nodeId]: {
        ...lastOpenedNote,
        ts: Date.now(),
        freq: lastOpenedNote.freq + 1
      }
    }
    // mog('addLastOpened', { nodeId, lastOpenedNotes })
    setLastOpenedNotes(newLastOpenedNotes)
  }

  const setMuteNode = (nodeId: string, muted: boolean) => {
    const lastOpenedNotes = useUserPreferenceStore.getState().lastOpenedNotes
    // const storeMeta = useUserPreferenceStore.getState().meta
    const lastOpenedNote = lastOpenedNotes[nodeId] || { ...INIT_LAST_OPENED }
    const newLastOpenedNotes = {
      ...lastOpenedNotes,
      [nodeId]: {
        ...lastOpenedNote,
        muted
      }
    }
    // mog('setMuteNode', { nodeId, muted, newLastOpenedNotes })
    setLastOpenedNotes(newLastOpenedNotes)
  }

  const muteNode = (nodeId: string) => {
    setMuteNode(nodeId, true)
  }
  const unmuteNode = (nodeId: string) => {
    setMuteNode(nodeId, false)
  }

  const getLastOpened = (nodeId: string, lastOpenedNote: LastOpenedData) => {
    const nodeType = getNodeType(nodeId)
    switch (nodeType) {
      case NodeType.DEFAULT: {
        const metadata = getILinkFromNodeid(nodeId)
        const updatedAt = metadata?.updatedAt ?? undefined
        const lastOpenedState = lastOpenedNote ? getLastOpenedState(updatedAt, lastOpenedNote) : undefined
        return lastOpenedState
      }
      case NodeType.SHARED: {
        const sharedNote = getSharedNode(nodeId)
        const updatedAt = sharedNote?.updatedAt ?? undefined
        const lastOpenedState = lastOpenedNote ? getLastOpenedState(updatedAt, lastOpenedNote) : undefined
        return lastOpenedState
      }
      default: {
        return undefined
      }
    }
  }

  // Callback so that the debounced function is only generated once
  const debouncedAddLastOpened = useCallback(debounce(addLastOpened, DEBOUNCE_TIME, { trailing: true }), [])

  return { addLastOpened, debouncedAddLastOpened, muteNode, unmuteNode, getLastOpened }
}
