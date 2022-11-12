import { client, useAuth } from '@workduck-io/dwindle'

import { ILink, apiURLs, mog, WORKSPACE_HEADER, USE_API } from '@mexit/core'

import { useAuthStore } from '../Stores/useAuth'
import { useContentStore } from '../Stores/useContentStore'
import { useDataStore } from '../Stores/useDataStore'
import { useApi } from './API/useNodeAPI'
import { getTitleFromPath } from './useLinks'
import { useSaver } from './useSaver'
import { useSearch } from './useSearch'

const useArchive = () => {
  const setArchive = useDataStore((state) => state.setArchive)
  const archive = useDataStore((state) => state.archive)
  const unArchive = useDataStore((state) => state.unArchive)
  const addInArchive = useDataStore((state) => state.addInArchive)
  const removeArchive = useDataStore((state) => state.removeFromArchive)
  const { getDataAPI } = useApi()

  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)

  const setContent = useContentStore((store) => store.setContent)
  const updateTagsCache = useDataStore((state) => state.updateTagsCache)
  const updateInternalLinks = useDataStore((state) => state.updateInternalLinks)

  const { updateDocument } = useSearch()
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

    mog('Archiving notes', { newArchiveNotes, intersection })

    return newArchiveNotes
  }

  const archived = (nodeid: string) => {
    return archive.find((node) => node.nodeid === nodeid)
  }

  const addArchiveData = async (nodes: ILink[], namespaceID: string): Promise<boolean> => {
    if (!USE_API) {
      addInArchive(nodes)
      return true
    }

    if (userCred) {
      return await client
        .put(
          apiURLs.archive.archiveInNamespace(namespaceID),
          {
            ids: nodes.map((i) => i.nodeid)
          },
          {
            headers: {
              [WORKSPACE_HEADER]: getWorkspaceId(),
              Accept: 'application/json, text/plain, */*'
            }
          }
        )
        .then((d: any) => {
          // We only get the data for archived nodeids in this response

          const archivedNodeids = d.data

          mog('Archived Nodes', { archivedNodeids, d })
          if (archivedNodeids && archivedNodeids?.length > 0) {
            const archivedNodes = nodes
              .filter((n) => archivedNodeids.includes(n.nodeid))
              .map((n) => ({ ...n, path: getTitleFromPath(n.path) }))
            addInArchive(archivedNodes)
          }
          // TODO: Once middleware is setup, use returned hierarchy to update the archived notes
          // const { archivedHierarchy } = d.data
          // mog('archivedHierarchy', { archivedHierarchy })

          // if (archivedHierarchy) {
          //   const addedArchivedLinks = hierarchyParser(archivedHierarchy, namespaceID, {
          //     withParentNodeId: true,
          //     allowDuplicates: true
          //   })

          //   if (addedArchivedLinks) {
          //     // * set the new hierarchy in the tree

          //     mog('addedArchivedLinks', { addedArchivedLinks })
          //     setArchive(addedArchivedLinks)
          //   }
          // }
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

  const unArchiveData = async (nodes: ILink[]) => {
    if (!USE_API) {
      return unArchive(nodes[0])
    }
    await client
      .put(
        apiURLs.archive.unArchiveNodes,
        {
          ids: nodes.map((i) => i.nodeid)
        },
        {
          headers: {
            [WORKSPACE_HEADER]: getWorkspaceId(),
            Accept: 'application/json, text/plain, */*'
          }
        }
      )
      .then((d) => {
        mog('Unarchive Data', d.data)
        if (d.data) unArchive(nodes[0])
        return d.data
      })
      .catch(console.error)
  }

  // TODO: figure how namespaces are working with archive hierarchy
  const getArchiveNotesHierarchy = async () => {
    await client
      .get(apiURLs.archive.getArchivedNodes, {
        headers: {
          [WORKSPACE_HEADER]: getWorkspaceId(),
          Accept: 'application/json, text/plain, */*'
        }
      })
      .then((d) => {
        if (d.data) {
          const hierarchy = d.data

          mog('getArchiveNotesHierarchy', { hierarchy })

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
        return d.data
      })
      .catch(mog)
  }

  const cleanCachesAfterDelete = (nodes: ILink[]) => {
    const linkCache = useDataStore.getState().linkCache
    const tagsCache = useDataStore.getState().tagsCache
    const removedPaths = nodes.map((n) => n.nodeid)
    const cleanTagCache = Object.entries(tagsCache).reduce((p, [k, v]) => {
      return { ...p, [k]: { nodes: v.nodes.filter((n) => !removedPaths.includes(n)) } }
    }, {})
    const cleanLinkCache = Object.entries(linkCache).reduce((p, [k, v]) => {
      if (removedPaths.includes(k)) return p
      return { ...p, [k]: v.filter((n) => !removedPaths.includes(n.nodeid)) }
    }, {})
    mog('Cleaning Caches', { nodes, linkCache, tagsCache, removedPaths, cleanTagCache, cleanLinkCache })
    updateTagsCache(cleanTagCache)
    updateInternalLinks(cleanLinkCache)
  }

  const removeArchiveData = async (nodeids: ILink[]): Promise<boolean> => {
    if (!USE_API) {
      removeArchive(nodeids)
      return true
    }

    if (userCred) {
      const res = await client
        .post(
          apiURLs.archive.deleteArchivedNodes,
          {
            ids: nodeids.map((i) => i.nodeid)
          },
          {
            headers: {
              [WORKSPACE_HEADER]: getWorkspaceId(),
              Accept: 'application/json, text/plain, */*'
            }
          }
        )
        // .then(console.log)
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
          console.log(e)
          return false
        })
      return res
    }
    return false
  }

  return { archived, addArchiveData, updateArchiveLinks, removeArchiveData, getArchiveNotesHierarchy, unArchiveData }
}

export default useArchive
