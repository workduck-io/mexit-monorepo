import {
  extractMetadata,
  Highlight,
  HighlightBlockMap,
  mog,
  NodeEditorContent,
  SEPARATOR,
  WORKSPACE_HEADER
} from '@mexit/core'
import toast from 'react-hot-toast'
import { useAuthStore } from './useAuth'
import { useHighlightStore2 } from '../Stores/useHighlightStore'
import { useCallback } from 'react'
import { isReadonly, usePermissions } from './usePermissions'
import { useContentStore } from '../Stores/useContentStore'
import { useLinks } from './useLinks'
import { useInternalLinks } from './useInternalLinks'
import { deserializeContent } from '../Utils/serializer'
import useRaju from './useRaju'

export const useHighlights = () => {
  const highlightBlockMap = useHighlightStore2((store) => store.highlightBlockMap)
  const removeHighlightFromStore = useHighlightStore2((s) => s.removeHighlight)
  const { accessWhenShared } = usePermissions()
  const { getContent } = useContentStore()
  const { getILinkFromNodeid } = useLinks()
  const { getParentILink } = useInternalLinks()
  const workspaceDetails = useAuthStore((state) => state.workspaceDetails)
  const { dispatch } = useRaju()
  const { deleteHighlight: deleteHighlightAPI } = useHighlightAPI()

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
      const notesToDelete = Object.keys(highlightBlockMap[highlightId] ?? {})
      const deleteContentInNotePromises = Array.from(new Set(notesToDelete)).map((nodeId) => {
        return deleteHighlightContent(nodeId, highlightId)
      })
      await Promise.all(deleteContentInNotePromises).then(() => {
        deleteHighlightAPI(highlightId).then(() => {
          removeHighlightFromStore(highlightId)
        })
      })
      return
    },
    [highlightBlockMap]
  )

  const deleteHighlightContent = (nodeId: string, highlightId: string) => {
    const content = getContent(nodeId)
    const node = getILinkFromNodeid(nodeId)
    // mog('deleteHighlightContent', { nodeId, highlightId, content, node })
    const parentILink = getParentILink(node?.path)

    return new Promise<void>((resolve, reject) => {
      const request = {
        type: 'CAPTURE_HANDLER',
        subType: 'SAVE_NODE',
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

      chrome.runtime.sendMessage(request, (response) => {
        const { message, error } = response
        // mog('MESSAGE OF DELETION', { message, request })

        if (error) {
          toast.error('An Error Occured. Please try again.')
          reject(error)
        } else {
          const nodeid = message.id
          const content = deserializeContent(message.data)
          const metadata = extractMetadata(message)

          dispatch('SET_CONTENT', nodeid, content, metadata)

          resolve()
        }
      })
    })
  }

  return {
    getHighlightMap,
    getEditableMap,
    deleteHighlight
  }
}

export const useHighlightSync = () => {
  // const highlightAPI = useHighlightAPI()
  const fetchAllHighlights = () => {
    //
  }

  return {
    fetchAllHighlights
  }
}

export const useHighlightAPI = () => {
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)

  const workspaceHeaders = () => ({
    [WORKSPACE_HEADER]: getWorkspaceId(),
    Accept: 'application/json, text/plain, */*'
  })

  //   /**
  //    * Fetches all links of the workspace
  //    */
  //   const getAllLinks = async () => {
  //     const request = {
  //       type: 'HIGHLIGHT',
  //       subType: 'GET_ALL_LINKS',
  //       headers: workspaceHeaders()
  //     }

  //     const links = chrome.runtime.sendMessage(request, (response) => {
  //       const { message, error } = response

  //       if (error) {
  //         mog('ErrorFetchingAllLinks', error)
  //         toast.error('An error occured. Please try again.')
  //       } else {
  //         mog('extract highlights', { message })
  //         return message
  //       }
  //     })

  //     return links
  //   }

  const saveHighlight = async (highlight: Highlight) => {
    const request = {
      type: 'HIGHLIGHT',
      subType: 'ADD_HIGHLIGHT',
      headers: workspaceHeaders(),
      body: {
        properties: highlight.properties,
        entityId: highlight.entityId
      }
    }

    const data = chrome.runtime.sendMessage(request, (response) => {
      const { message, error } = response

      if (error) {
        mog('ErrorSavingLink', error)
        toast.error('An error occured. Please try again.')
      } else {
        return message
      }
    })

    return data
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

      // OOK
    })
  }

  return {
    saveHighlight,
    deleteHighlight
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
