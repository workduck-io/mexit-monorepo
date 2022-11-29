import {
  AccessLevel,
  API,
  batchArrayWithNamespaces,
  extractMetadata,
  generateNamespaceId,
  iLinksToUpdate,
  MIcon,
  mog
} from '@mexit/core'
import toast from 'react-hot-toast'

import { useDataStore } from '../../Stores/useDataStore'
import { deserializeContent } from '../../Utils/serializer'
import { WorkerRequestType } from '../../Utils/worker'
import { runBatchWorker } from '../../Workers/controller'
import { useUpdater } from '../useUpdater'

export const useNamespaceApi = () => {
  const { setNamespaces, setIlinks } = useDataStore()
  const { updateFromContent } = useUpdater()

  const getAllNamespaces = async () => {
    const namespaces = await API.namespace
      .getAll()
      .then((d: any) => {
        // mog('namespaces all', d.data)
        return d.map((item: any) => {
          // metadata is json string parse to object
          return {
            ns: {
              id: item.id,
              name: item.name,
              icon: item.metadata?.icon ?? undefined,
              access: item.accessType,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
              granterID: item.granterID ?? undefined,
              publicAccess: item.publicAccess
            },
            nodeHierarchy: item.nodeHierarchy.map((i) => ({ ...i, namespace: item.id })),
            archiveHierarchy: item?.archivedNodeHierarchyInformation
          }
        })
      })
      .catch((e) => {
        mog('Error fetching all namespaces', { e })
        return undefined
      })

    if (namespaces) {
      const newILinks = namespaces.reduce((arr, { nodeHierarchy }) => {
        return [...arr, ...nodeHierarchy]
      }, [])
      const localILinks = useDataStore.getState().ilinks

      mog('update namespaces and ILinks', { namespaces, newILinks })
      // SetILinks once middleware is integrated
      const ns = namespaces.map((n) => n.ns)
      setNamespaces(ns)
      // TODO: Also set archive links
      setIlinks(newILinks)

      const { toUpdateLocal } = iLinksToUpdate(localILinks, newILinks)

      const ids = batchArrayWithNamespaces(toUpdateLocal, ns, 10)

      const { fulfilled } = await runBatchWorker(WorkerRequestType.GET_NODES, 6, ids)

      fulfilled.forEach((nodes) => {
        if (nodes) {
          const { rawResponse } = nodes
          // setRequest(apiURLs.node.getMultipleNode(), { ...requestData, url: apiURLs.node.getMultipleNode() })

          if (rawResponse) {
            rawResponse.forEach((nodeResponse) => {
              const metadata = extractMetadata(nodeResponse) // added by Varshitha
              const content = deserializeContent(nodeResponse.data)
              updateFromContent(nodeResponse.id, content, metadata)
            })
          }
        }
      })
    }
  }

  const getNamespace = async (id: string) => {
    const namespace = await API.namespace
      .get(id)
      .then((d: any) => {
        mog('namespaces specific', { data: d, id })
        // return d?.nodeHierarchy

        return {
          id: d?.id,
          name: d?.name,
          icon: d?.metadata?.icon ?? undefined,
          nodeHierarchy: d?.nodeHierarchy,
          createdAt: d?.createdAt,
          updatedAt: d?.updatedAt,
          publicAccess: d?.publicAccess
        }
      })
      .catch((e) => {
        mog('Save error', e)
        return undefined
      })

    return namespace
  }

  const getPublicNamespaceAPI = async (namespaceID: string) => {
    const res = await API.namespace.getPublic(namespaceID)
    return res
  }

  const makeNamespacePublic = async (namespaceID: string) => {
    const res = await API.namespace.makePublic(namespaceID)
    return res
  }

  const makeNamespacePrivate = async (namespaceID: string) => {
    const res = await API.namespace.makePrivate(namespaceID)
    return res
  }

  const createNewNamespace = async (name: string) => {
    try {
      const req = {
        type: 'NamespaceRequest',
        name,
        id: generateNamespaceId(),
        metadata: {
          icon: {
            type: 'ICON',
            value: 'heroicons-outline:view-grid'
          }
        }
      }
      const res = await API.namespace.create(req).then((d: any) => ({
        id: req.id,
        name: name,
        iconUrl: req.metadata.icon,
        access: 'MANAGE' as const,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }))

      mog('We created a namespace', { res })

      return res
    } catch (err) {
      toast('Unable to Create New Namespace')
    }
  }

  const changeNamespaceName = async (id: string, name: string) => {
    try {
      const res = await API.namespace.update({ id, name }).then(() => true)
      return res
    } catch (err) {
      throw new Error('Unable to update namespace')
    }
  }

  const changeNamespaceIcon = async (id: string, name: string, icon: MIcon) => {
    try {
      const res = await API.namespace
        .update({
          id,
          name,
          metadata: { icon }
        })
        .then(() => icon)
      return res
    } catch (err) {
      throw new Error('Unable to update namespace icon')
    }
  }

  const shareNamespace = async (id: string, userIDs: string[], accessType: AccessLevel) => {
    try {
      const res = await API.namespace.share(id, userIDs, accessType)
      mog('Shared a namespace', { res })
      return res
    } catch (err) {
      throw new Error(`Unable to share namespace: ${err}`)
    }
  }

  const revokeNamespaceShare = async (id: string, userIDs: string[]) => {
    try {
      const res = await API.namespace.revokeAccess(id, userIDs)
      mog('revoke access users', res)
      return res
    } catch (err) {
      throw new Error(`Unable to revoke namespace access: ${err}`)
    }
  }

  const updateNamespaceShare = async (id: string, userIDToAccessTypeMap: { [userid: string]: AccessLevel }) => {
    try {
      return await API.namespace.updateAccess(id, userIDToAccessTypeMap).then((resp) => {
        mog('changeUsers resp', { resp })
        return resp
      })
    } catch (err) {
      throw new Error(`Unable to update namespace access: ${err}`)
    }
  }

  const getAllSharedUsers = async (id: string): Promise<{ users: Record<string, string> }> => {
    try {
      return await API.share.getNamespacePermissions(id).then((resp: any) => {
        mog('get all shared users', resp)
        return { users: resp }
      })
    } catch (err) {
      mog(`Unable to get shared namespace users: ${err}`)
      return { users: {} }
    }
  }

  return {
    createNewNamespace,
    getAllNamespaces,
    getNamespace,
    changeNamespaceName,
    changeNamespaceIcon,
    shareNamespace,
    revokeNamespaceShare,
    getAllSharedUsers,
    updateNamespaceShare,
    getPublicNamespaceAPI,
    makeNamespacePublic,
    makeNamespacePrivate
  }
}
