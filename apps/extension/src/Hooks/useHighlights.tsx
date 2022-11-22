import { Highlight, HighlightBlockMap, mog, WORKSPACE_HEADER } from '@mexit/core'
import toast from 'react-hot-toast'
import { useAuthStore } from './useAuth'
import { useHighlightStore2 } from '../Stores/useHighlightStore'
import { useCallback } from 'react'
import { isReadonly, usePermissions } from './usePermissions'

export const useHighlights = () => {
  const highlightBlockMap = useHighlightStore2((store) => store.highlightBlockMap)
  const { accessWhenShared } = usePermissions()

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

  return {
    getHighlightMap,
    getEditableMap
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

  const deleteHighlight = async (highlight: Highlight) => {
    const request = {
      subType: 'DELETE_HIGHLIGHT',
      headers: workspaceHeaders(),
      body: {
        highlightId: highlight.entityId
      }
    }

    const data = chrome.runtime.sendMessage(request, (response) => {
      const { message, error } = response

      if (error) {
        mog('ErrorDeletingLink', error)
        toast.error('An error occured. Please try again.')
      } else {
        return message
      }
    })

    return data
    // OOK
  }

  return {
    saveHighlight,
    deleteHighlight
  }
}
