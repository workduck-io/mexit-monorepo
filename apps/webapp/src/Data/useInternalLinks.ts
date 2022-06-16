import { client } from '@workduck-io/dwindle'

import { apiURLs, ILink, mog, SEPARATOR } from '@mexit/core'
import { getNodeIcon } from '@mexit/shared'

import { useAuthStore } from '../Stores/useAuth'
import { useDataStore } from '../Stores/useDataStore'

export const useInternalLinks = () => {
  const setILinks = useDataStore((store) => store.setIlinks)
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const ilinks = useDataStore((store) => store.ilinks)

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

  const updateSingleILink = (nodeId: string, path: string) => {
    const newILink: ILink = {
      nodeid: nodeId,
      path: path,
      icon: getNodeIcon(path)
    }
    const currILinks = useDataStore.getState().ilinks
    setILinks([...currILinks, newILink])
  }

  const getParentILink = (path: string) => {
    const parentPath = path.split(SEPARATOR).slice(0, -1).join(SEPARATOR)

    return ilinks.find((ilink) => ilink.path === parentPath)
  }

  return { getILinks, refreshILinks, updateILinksFromAddedRemovedPaths, getParentILink, updateSingleILink }
}
