import { useAuth } from '@workduck-io/dwindle'

import { API, ILink, mog, useDataStore } from '@mexit/core'
import { getTitleFromPath } from '@mexit/shared'

const useArchive = () => {
  const setArchive = useDataStore((state) => state.setArchive)
  const archive = useDataStore((state) => state.archive)
  const unArchive = useDataStore((state) => state.unArchive)
  const addInArchive = useDataStore((state) => state.addInArchive)
  const removeArchive = useDataStore((state) => state.removeFromArchive)

  const updateTagsCache = useDataStore((state) => state.updateTagsCache)
  const updateInternalLinks = useDataStore((state) => state.updateInternalLinks)

  const { userCred } = useAuth()

  const updateArchiveLinks = (addedILinks: Array<ILink>, removedILinks: Array<ILink>): Array<ILink> => {
    const archive = useDataStore.getState().archive

    // * Find the Removed Notes
    const intersection = removedILinks.filter((l) => {
      const note = addedILinks.find((rem) => l.nodeid === rem.nodeid)
      return !note
    })

    const newArchiveNotes = [...archive, ...intersection]
    setArchive(newArchiveNotes)

    return newArchiveNotes
  }

  const archived = (nodeid: string) => {
    return archive.find((node) => node.nodeid === nodeid)
  }

  const addArchiveData = async (nodes: ILink[], namespaceID: string): Promise<boolean> => {
    if (userCred) {
      return await API.node
        .archive(
          namespaceID,
          nodes.map((node) => node.nodeid)
        )
        .then((archivedNodeids: any) => {
          // We only get the data for archived nodeids in this response

          mog('Archived Nodes', { archivedNodeids })
          if (archivedNodeids && archivedNodeids?.length > 0) {
            const archivedNodes = nodes
              .filter((n) => archivedNodeids.includes(n.nodeid))
              .map((n) => ({ ...n, path: getTitleFromPath(n.path) }))
            addInArchive(archivedNodes)
          }
          return true
        })
        .catch((e) => {
          console.error(e)
          return false
        })
    }
    return false
  }

  const unArchiveData = async (nodes: ILink[]) => {
    await API.node
      .unarchive(
        nodes[0].namespace,
        nodes.map((node) => node.nodeid)
      )
      .then((d) => {
        mog('Unarchive Data', d)
        if (d) unArchive(nodes[0])
        return d
      })
      .catch(console.error)
  }

  // TODO: figure how namespaces are working with archive hierarchy
  const getArchiveNotesHierarchy = async () => {
    await API.node
      .allArchived()
      .then((hierarchy) => {
        if (hierarchy) {
          // mog('getArchiveNotesHierarchy', { hierarchy })
          // const archivedNotes = hierarchyParser(hierarchy, { withParentNodeId: true, allowDuplicates: true })
          // if (archivedNotes && archivedNotes.length > 0) {
          //   const localILinks = useDataStore.getState().archive
          //   const { toUpdateLocal } = iLinksToUpdate(localILinks, archivedNotes)
          //   runBatch(
          //     toUpdateLocal.map((ilink) =>
          //       getDataAPI(ilink.nodeid, false, false, false).then((data) => {
          //         setContent(ilink.nodeid, data.content, data.metadata)
          //         updateDocument('archive', ilink.nodeid, data.content)
          //       })
          //     )
          //   )
          // }
          // setArchive(archivedNotes)
        }
        return hierarchy
      })
      .catch(console.error)
  }

  const cleanCachesAfterDelete = (nodes: ILink[]) => {
    const linkCache = useDataStore.getState().linkCache
    const tagsCache = useDataStore.getState().tagsCache
    const removedPaths = nodes.map((n) => n.nodeid)
    const cleanTagCache = Object.entries(tagsCache).reduce((p, [k, v]: [k: string, v: any]) => {
      return { ...p, [k]: { nodes: v.nodes.filter((n) => !removedPaths.includes(n)) } }
    }, {})
    const cleanLinkCache = Object.entries(linkCache).reduce((p, [k, v]: [k: string, v: any]) => {
      if (removedPaths.includes(k)) return p
      return { ...p, [k]: v.filter((n) => !removedPaths.includes(n.nodeid)) }
    }, {})
    updateTagsCache(cleanTagCache)
    updateInternalLinks(cleanLinkCache)
  }

  const removeArchiveData = async (nodeids: ILink[]): Promise<boolean> => {
    if (userCred) {
      const res = await API.node
        .deleteArchived(nodeids.map((i) => i.nodeid))
        .then(() => {
          removeArchive(nodeids)
        })
        .then(() => {
          cleanCachesAfterDelete(nodeids)
        })
        .then(() => {
          return true
        })
        .catch((e) => {
          console.error(e)
          return false
        })
      return res
    }
    return false
  }

  return { archived, addArchiveData, updateArchiveLinks, removeArchiveData, getArchiveNotesHierarchy, unArchiveData }
}

export default useArchive
