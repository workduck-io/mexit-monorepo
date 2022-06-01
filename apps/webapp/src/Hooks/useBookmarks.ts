import { client, useAuth } from '@workduck-io/dwindle'

import { apiURLs } from '@mexit/core'
import { WORKSPACE_HEADER } from '../Data/constants'
import { useAuthStore } from '../Stores/useAuth'
import { useDataStore, useLinks } from '@workduck-io/mex-editor'

export const useBookmarks = () => {
  const setBookmarks = useDataStore((state) => state.setBookmarks)
  const addBookmarks = useDataStore((state) => state.addBookmarks)
  const removeBookmarks = useDataStore((state) => state.removeBookamarks)
  const { userCred } = useAuth()
  const { getPathFromNodeid } = useLinks()

  const workspaceDetails = useAuthStore((store) => store.workspaceDetails)

  const isBookmark = (nodeid: string) => {
    const bookmarks = useDataStore.getState().bookmarks
    return bookmarks.indexOf(nodeid) > -1
  }

  const addBookmark = async (nodeid: string): Promise<boolean> => {
    if (userCred) {
      return await client
        .post(
          apiURLs.bookmark(userCred.userId, nodeid),
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
      .get(apiURLs.getBookmarks(userCred.userId), {
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
          apiURLs.bookmark(userCred.userId, nodeid),
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
