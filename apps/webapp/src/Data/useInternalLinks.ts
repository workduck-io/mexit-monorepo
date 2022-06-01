import { apiURLs, ILink, mog } from '@mexit/core'
import { client } from '@workduck-io/dwindle'
import { useDataStore } from '@workduck-io/mex-editor'
import { useAuthStore } from '../Stores/useAuth'

export const useInternalLinks = () => {
  const setILinks = useDataStore((store) => store.setIlinks)
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)

  const getILinks = async () => {
    return await client
      .get(apiURLs.getILink(), {
        headers: {
          'mex-workspace-id': getWorkspaceId()
        }
      })
      .then((res: any) => {
        return res.data
      })
      .catch(console.error)
  }

  const refreshILinks = async () => {
    const updatedILinks: any[] = await getILinks()
    if (updatedILinks && updatedILinks.length > 0) {
      setILinks(updatedILinks)
    }
  }

  const updateILinksFromAddedRemovedPaths = (addedPaths: ILink[], removedPaths: ILink[]) => {
    const currILinks = useDataStore.getState().ilinks
    removedPaths.forEach((path) => {
      currILinks.splice(
        currILinks.findIndex((item) => item.nodeid === path.nodeid),
        1
      )
    })
    addedPaths.forEach((path) => {
      currILinks.push(path)
    })
    mog('Setting ILinks', { currILinks })
    setILinks(currILinks)
  }
  return { getILinks, refreshILinks, updateILinksFromAddedRemovedPaths }
}
