import { client } from '@workduck-io/dwindle'

import { apiURLs, generateNodeUID, ILink, mog, SEPARATOR, getAllParentPaths, getNodeIcon } from '@mexit/core'

import { useAuthStore } from '../Stores/useAuth'
import { useDataStore } from '../Stores/useDataStore'
import { getNodeidFromPathAndLinks } from './useLinks'

const appendToText = (text: string, textToAppend: string, separator = SEPARATOR) => {
  if (!text) return textToAppend
  return `${text}${separator}${textToAppend}`
}

export const useInternalLinks = () => {
  const setILinks = useDataStore((store) => store.setIlinks)
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const ilinks = useDataStore((store) => store.ilinks)
  const checkValidILink = useDataStore((store) => store.checkValidILink)

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
    const updatedILinks: any[] = (await getILinks()).ilinks
    mog('UpdatingILinks', { updatedILinks })
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
    addedPaths.forEach((p) => {
      const idx = currILinks.find((link) => link.nodeid === p.nodeid && link.path === p.path)
      if (idx === undefined) currILinks.push(p)
    })
    mog('Setting ILinks', { currILinks })
    setILinks([...currILinks])
  }

  const updateSingleILink = (nodeId: string, path: string) => {
    const newILink: ILink = {
      nodeid: nodeId,
      path: path,
      icon: getNodeIcon(path)
    }
    const currILinks = useDataStore.getState().ilinks.filter((item) => item.nodeid !== nodeId)
    setILinks([...currILinks, newILink])
  }

  const updateMultipleILinks = (ilinks: ILink[]) => {
    const currILinks = useDataStore.getState().ilinks
    setILinks([...currILinks, ...ilinks])
  }

  const getParentILink = (path: string) => {
    const parentPath = path.split(SEPARATOR).slice(0, -1).join(SEPARATOR)

    return ilinks.find((ilink) => ilink.path === parentPath)
  }

  const getEntirePathILinks = (ilink: string, nodeID: string) => {
    const pathStrings = useDataStore.getState().ilinks.map((ilink) => ilink.path)
    const parents = getAllParentPaths(ilink) // includes link of child

    const newPaths = parents.filter((l) => !pathStrings.includes(l)) // only create links for non existing

    const newILinks: ILink[] = newPaths.map((l) => {
      const addedILink = { nodeid: nodeID && l === ilink ? nodeID : generateNodeUID(), path: l, icon: getNodeIcon(l) }
      addedILink.path = checkValidILink({ ilink: addedILink.path, showAlert: true, parentId: undefined })

      return addedILink
    })
    mog(`Entire Path ILinks`, { pathStrings, parents, newPaths, newILinks })

    return newILinks
  }

  const createNoteHierarchyString = (notePath: string) => {
    const ilinks = useDataStore.getState().ilinks
    let prefix = ''

    const noteLink = notePath.split(SEPARATOR).reduce((prevPath, currentNotePath) => {
      prefix = appendToText(prefix, currentNotePath)

      const currentNoteId = getNodeidFromPathAndLinks(ilinks, prefix)
      const linkWithTitle = appendToText(prevPath, currentNotePath, '#')
      const link = appendToText(linkWithTitle, currentNoteId, '#')

      return link
    }, '')

    return noteLink
  }

  return {
    getILinks,
    refreshILinks,
    updateILinksFromAddedRemovedPaths,
    getParentILink,
    updateSingleILink,
    updateMultipleILinks,
    getEntirePathILinks,
    createNoteHierarchyString
  }
}
