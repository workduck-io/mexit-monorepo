import { client, useAuth } from '@workduck-io/dwindle'

import { ILink, apiURLs, mog } from '@mexit/core'

import { WORKSPACE_HEADER } from '../Data/constants'
import { useAuthStore } from '../Stores/useAuth'
import { useSaver } from './useSaver'
import { useDataStore } from '../Stores/useDataStore'

const useArchive = () => {
  const setArchive = useDataStore((state) => state.setArchive)
  const archive = useDataStore((state) => state.archive)
  const unArchive = useDataStore((state) => state.unArchive)
  const addInArchive = useDataStore((state) => state.addInArchive)
  const removeArchive = useDataStore((state) => state.removeFromArchive)

  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)

  const updateTagsCache = useDataStore((state) => state.updateTagsCache)
  const updateInternalLinks = useDataStore((state) => state.updateInternalLinks)

  const { onSave } = useSaver()
  // const { saveData } = useSaveData()
  const { userCred } = useAuth()

  const archived = (nodeid: string) => {
    return archive.find((node) => node.nodeid === nodeid)
  }

  const addArchiveData = async (nodes: ILink[]): Promise<boolean> => {
    if (userCred) {
      return await client
        .put(
          apiURLs.archiveNodes(),
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
        // .then(console.log)
        .then(() => {
          addInArchive(nodes)
        })
        .then(() => onSave())
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
    await client
      .put(
        apiURLs.unArchiveNodes(),
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

  const getArchiveData = async () => {
    await client
      .get(apiURLs.getArchivedNodes(getWorkspaceId()), {
        headers: {
          [WORKSPACE_HEADER]: getWorkspaceId(),
          Accept: 'application/json, text/plain, */*'
        }
      })
      .then((d: any) => {
        if (d.data) {
          const ids = d.data
          const links = ids.filter((id) => archive.filter((ar) => ar.nodeid === id).length === 0)
          setArchive(links)
        }
        return d.data
      })
      .catch(console.error)
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
    if (userCred) {
      const res = await client
        .post(
          apiURLs.deleteArchiveNodes(),
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

  return { archived, addArchiveData, removeArchiveData, getArchiveData, unArchiveData }
}

export default useArchive
