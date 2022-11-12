import { client, useAuth } from '@workduck-io/dwindle'

import { apiURLs, WORKSPACE_HEADER } from '@mexit/core'

import { useAuthStore } from '../Stores/useAuth'
import { useDataStore } from '../Stores/useDataStore'
import { useLinks } from './useLinks'

/**
 * Has been repurposed into starred notes
 * TODO: Refactor after namespaces from backend
 */
export const useBookmarks = () => {
  const setBookmarks = useDataStore((state) => state.setBookmarks)
  const addBookmarks = useDataStore((state) => state.addBookmarks)
  const removeBookmarks = useDataStore((state) => state.removeBookamarks)
  const { userCred } = useAuth()
  const { getPathFromNodeid } = useLinks()

  const workspaceDetails = useAuthStore((store) => store.workspaceDetails)

  const isBookmark = (nodeid: string) => {
    const bookmarks = useDataStore.getState().bookmarks
    return [...bookmarks].indexOf(nodeid) > -1
  }

  const addBookmark = async (nodeid: string): Promise<boolean> => {
    if (userCred) {
      return await client
        .post(
          apiURLs.bookmarks.create(nodeid),
          {
            type: 'BookmarkRequest'
          },
          {
            headers: {
              [WORKSPACE_HEADER]: workspaceDetails.id,
              Accept: 'application/json, text/plain, */*'
            }
          }
        )
        .then(() => {
          addBookmarks([nodeid])
        })
        .then(() => {
          return true
        })
        .catch((e) => {
          console.log(e)
          return false
        })
    }
    return false
  }

  const getAllBookmarks = async () => {
    await client
      .get(apiURLs.bookmarks.getAll, {
        headers: {
          [WORKSPACE_HEADER]: workspaceDetails.id,
          Accept: 'application/json, text/plain, */*'
        }
      })
      .then((d: any) => {
        if (d.data) {
          const bookmarks = d.data.filter((nodeid: string) => getPathFromNodeid(nodeid) !== undefined)
          setBookmarks(bookmarks)
        }
        return d.data
      })
      .catch(console.error)
  }

  const removeBookmark = async (nodeid: string): Promise<boolean> => {
    if (userCred) {
      const res = await client
        .patch(
          apiURLs.bookmarks.create(nodeid),
          {
            type: 'BookmarkRequest'
          },
          {
            headers: {
              [WORKSPACE_HEADER]: workspaceDetails.id,
              Accept: 'application/json, text/plain, */*'
            }
          }
        )
        // .then(console.log)
        .then(() => {
          removeBookmarks([nodeid])
        })
        .then(() => {
          return true
        })
        .catch((e) => {
          console.log(e)
          return false
        })
      return res
    }
    return false
  }

  return { isBookmark, addBookmark, removeBookmark, getAllBookmarks }
}
