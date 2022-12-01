import { useAuth } from '@workduck-io/dwindle'

import { API } from '@mexit/core'

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

  const addBookmark = async (nodeid: string) => {
    if (userCred) {
      await API.bookmark
        .create(nodeid)
        .then(() => {
          addBookmarks([nodeid])
        })
        .catch(console.error)
    }
  }

  const getAllBookmarks = async () => {
    await API.bookmark
      .getAll()
      .then((d: any) => {
        if (d) {
          const bookmarks = d.filter((nodeid: string) => getPathFromNodeid(nodeid) !== undefined)
          setBookmarks(bookmarks)
        }
        return d
      })
      .catch(console.error)
  }

  const removeBookmark = async (nodeid: string) => {
    if (userCred) {
      return await API.bookmark
        .remove(nodeid)
        // .then(console.log)
        .then(() => {
          removeBookmarks([nodeid])
        })
        .catch(console.error)
    }
  }

  return { isBookmark, addBookmark, removeBookmark, getAllBookmarks }
}
