import { useCallback } from 'react'
import toast from 'react-hot-toast'

import {
  Highlight,
  mog,
  NodeEditorContent,
  SEPARATOR,
  useAuthStore,
  useContentStore,
  useHighlightStore,
  WORKSPACE_HEADER
} from '@mexit/core'

import { useLinkURLs } from '../Hooks/useURLs'

import { useInternalLinks } from './useInternalLinks'
import { useLinks } from './useLinks'
import { isReadonly, usePermissions } from './usePermissions'

export const useHighlights = () => {
  const highlightBlockMap = useHighlightStore((store) => store.highlightBlockMap)
  const removeHighlightFromStore = useHighlightStore((s) => s.removeHighlight)
  const { accessWhenShared } = usePermissions()
  const { getContent } = useContentStore()
  const { getILinkFromNodeid } = useLinks()
  const { getParentILink } = useInternalLinks()
  const workspaceDetails = useAuthStore((state) => state.workspaceDetails)
  const setContent = useContentStore((s) => s.setContent)
  const {
    deleteHighlight: deleteHighlightAPI,
    saveHighlight: saveHighlightAPI,
    deleteHighlightContent
  } = useHighlightAPI()
  const { getLink, saveLink } = useLinkURLs()

  /**
   * Returns the map of nodeids and blockids in which the content of the highlight is present
   */
  const getHighlightMap = useCallback(
    (highlighId: string) => {
      const highlightMap = highlightBlockMap[highlighId]
      return highlightMap
    },
    [highlightBlockMap]
  )

  const getEditableMap = useCallback(
    (highlighId: string) => {
      const highlightMap = highlightBlockMap[highlighId]
      const editableMap = Object.keys(highlightMap ?? {}).reduce((acc, nodeId) => {
        const access = accessWhenShared(nodeId)
        // mog('Access', { access, node })
        const isNodeEditable = !isReadonly(access)

        if (isNodeEditable) {
          acc[nodeId] = highlightMap[nodeId]
        }
        return acc
      }, {} as Record<string, string[]>)
      return editableMap
    },
    [highlightBlockMap]
  )

  const deleteHighlight = useCallback(
    async (highlightId: string) => {
      // mog('deleteHighlight', { highlightId })
      try {
        const noteBlocksToDelete = highlightBlockMap[highlightId] ?? {}

        if (Object.keys(noteBlocksToDelete).length === 0) {
          // mog('No notes to delete')
          return
        }
        await deleteHighlightContent(noteBlocksToDelete)
        mog('Deleted highlight content')
        await deleteHighlightAPI(highlightId)
        mog('Deleted highlight in API')

        removeHighlightFromStore(highlightId)
        mog('Removed highlight from store')

        const deleteContentInNotePromises = Array.from(new Set(Object.keys(noteBlocksToDelete))).map((nodeId) => {
          return deleteHighlightContentInStores(nodeId, highlightId)
        })
        await Promise.all(deleteContentInNotePromises).then(() => {
          mog('Deleted highlight content in notes')
        })
        return
      } catch (error) {
        mog('Error deleting highlight', { error })
        toast.error('Error deleting highlight')
      }
    },
    [highlightBlockMap]
  )

  const deleteHighlightContentInStores = (nodeId: string, highlightId: string) => {
    const content = getContent(nodeId)
    const node = getILinkFromNodeid(nodeId)
    // mog('deleteHighlightContent', { nodeId, highlightId, content, node })
    const parentILink = getParentILink(node?.path)

    return new Promise<void>((resolve, reject) => {
      const request = {
        data: {
          id: node.nodeid,
          title: node.path.split(SEPARATOR).slice(-1)[0],
          // This is not blockID anymore mia amore
          content: filterHighlightBlocks(content.content, highlightId),
          referenceID: parentILink?.nodeid,
          namespaceID: node.namespace,
          workspaceID: workspaceDetails.id,
          metadata: {}
        }
      }

      const nodeid = node.nodeid

      setContent(nodeid, request.data.content)
      resolve()
    })
  }

  /**
   * Saves the highlight in the backend database
   * Adds a link if the source url is not already saved
   *
   * Doesn't add to the store.
   *   That will need the block map.
   */
  const saveHighlight = async (highlight: Highlight, sourceTitle: string) => {
    // const link = getLink(highlight.properties.sourceUrl)
    // if (!link) {
    //   await saveLink({ url: highlight.properties.sourceUrl, title: sourceTitle })
    // }
    return await saveHighlightAPI(highlight)
  }

  return {
    getHighlightMap,
    getEditableMap,
    deleteHighlight,
    saveHighlight
  }
}

export const useHighlightAPI = () => {
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)

  const workspaceHeaders = () => ({
    [WORKSPACE_HEADER]: getWorkspaceId(),
    Accept: 'application/json, text/plain, */*'
  })

  const saveHighlight = async (highlight: Highlight) => {
    const request = {
      type: 'HIGHLIGHT',
      subType: 'ADD_HIGHLIGHT',
      headers: workspaceHeaders(),
      body: highlight
    }

    const response = await chrome.runtime.sendMessage(request)

    const { message, error } = response

    if (error) {
      mog('ErrorSavingLink', error)
      toast.error('An error occured. Please try again.')
    } else {
      return message
    }
  }

  const deleteHighlight = async (highlightId: string) => {
    return new Promise<void>((resolve, reject) => {
      const request = {
        type: 'HIGHLIGHT',
        subType: 'DELETE_HIGHLIGHT',
        headers: workspaceHeaders(),
        body: {
          highlightId
        }
      }

      chrome.runtime.sendMessage(request, (response) => {
        const { message, error } = response

        if (error) {
          mog('ErrorDeletingLink', error)
          toast.error('An error occured. Please try again.')
          reject(error)
        } else {
          mog('Deleted highlight', { message })
          // return message
          resolve(message)
        }
      })
    })
  }

  const deleteHighlightContent = async (blockMap: Record<string, string[]>) => {
    return new Promise<void>((resolve, reject) => {
      const request = {
        type: 'NODE_CONTENT',
        subType: 'DELETE_BLOCKS',
        headers: workspaceHeaders(),
        body: {
          blockMap
        }
      }

      chrome.runtime.sendMessage(request, (response) => {
        const { message, error } = response

        if (error) {
          mog('ErrorDeletingLink', error)
          toast.error('An error occured. Please try again.')
          reject(error)
        } else {
          mog('Deleted highlight', { message })
          // return message
          resolve(message)
        }
      })
    })
  }

  return {
    saveHighlight,
    deleteHighlight,
    deleteHighlightContent
  }
}

const filterHighlightBlocks = (content: NodeEditorContent, highlightId: string) => {
  return content.filter((block) => {
    if (
      block?.metadata?.elementMetadata?.type === 'highlightV1' &&
      block?.metadata?.elementMetadata?.id === highlightId
    ) {
      return false
    }
    return true
  })
}
