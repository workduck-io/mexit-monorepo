import { API, generateNodeUID, getAllParentPaths, getNodeIcon, ILink, mog, SEPARATOR, useDataStore } from '@mexit/core'

import { getNodeidFromPathAndLinks } from './useLinks'

const appendToText = (text: string, textToAppend: string, separator = SEPARATOR) => {
  if (!text) return textToAppend
  return `${text}${separator}${textToAppend}`
}

export const useInternalLinks = () => {
  const setILinks = useDataStore((store) => store.setIlinks)
  const ilinks = useDataStore((store) => store.ilinks)
  const checkValidILink = useDataStore((store) => store.checkValidILink)

  const getILinks = async () => {
    return await (API.namespace.getHeirarchy() as any).catch(console.error)
  }

  const refreshILinks = async () => {
    const updatedILinks: any[] = await getILinks()
    // mog('UpdatingILinks', { updatedILinks })
    // if (updatedILinks && updatedILinks.length > 0) {
    const { nodes, namespaces } = Object.entries(updatedILinks).reduce(
      (p, [namespaceid, namespaceData]) => {
        return {
          namespaces: [
            ...p.namespaces,
            {
              id: namespaceid,
              name: namespaceData.name,
              ...namespaceData?.namespaceMetadata
            }
          ],
          nodes: [
            ...p.nodes,
            ...namespaceData.nodeHierarchy.map((ilink) => ({
              ...ilink,
              namespace: namespaceid
            }))
          ]
        }
      },
      { nodes: [], namespaces: [] }
    )
    mog('UpdatingILinks', { nodes, namespaces })
    setILinks(nodes)
  }

  const updateILinksFromAddedRemovedPaths = (addedPaths: ILink[], removedPaths: ILink[]) => {
    let currILinks = useDataStore.getState().ilinks

    const intersection = removedPaths.filter((l) => addedPaths.find((rem) => l.nodeid === rem.nodeid))
    intersection.forEach((path) => {
      currILinks.splice(
        currILinks.findIndex((item) => item.nodeid === path.nodeid),
        1
      )
    })

    addedPaths.forEach((p) => {
      const idx = currILinks.find((link) => link.nodeid === p.nodeid)

      if (idx && idx.path !== p.path) {
        currILinks = currILinks.map((link) => (link.nodeid === p.nodeid ? { ...link, path: p.path } : link))
      } else if (idx === undefined) {
        currILinks.push({ ...p, createdAt: Infinity })
      }
    })
    mog('Setting ILinks', { currILinks })

    setILinks([...currILinks])
  }

  const updateSingleILink = (nodeId: string, path: string, namespace: string) => {
    const newILink: ILink = {
      nodeid: nodeId,
      path: path,
      icon: getNodeIcon(path),
      namespace: namespace
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

  const getEntirePathILinks = (ilink: string, nodeID: string, namespace: string) => {
    const pathStrings = useDataStore
      .getState()
      .ilinks.filter((i) => i.namespace === namespace)
      .map((ilink) => ilink.path)

    const parents = getAllParentPaths(ilink) // includes link of child

    const newPaths = parents.filter((l) => !pathStrings.includes(l)) // only create links for non existing

    const newILinks: ILink[] = newPaths.map((l) => {
      const addedILink = {
        nodeid: nodeID && l === ilink ? nodeID : generateNodeUID(),
        path: l,
        icon: getNodeIcon(l),
        namespace: namespace
      }

      addedILink.path = checkValidILink({ notePath: addedILink.path, showAlert: true, openedNotePath: undefined })

      return addedILink
    })
    mog(`Entire Path ILinks`, { pathStrings, parents, newPaths, newILinks })

    return newILinks
  }

  const createNoteHierarchyString = (notePath: string, namespace: string) => {
    const ilinks = useDataStore.getState().ilinks
    let prefix = ''

    const noteLink = notePath.split(SEPARATOR).reduce((prevPath, currentNotePath) => {
      prefix = appendToText(prefix, currentNotePath)

      const currentNoteId = getNodeidFromPathAndLinks(ilinks, prefix, namespace)
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
