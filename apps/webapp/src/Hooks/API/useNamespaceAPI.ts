import toast from 'react-hot-toast'

import { client } from '@workduck-io/dwindle'

import {
  apiURLs,
  generateNamespaceId,
  runBatch,
  iLinksToUpdate,
  MIcon,
  mog,
  WORKSPACE_HEADER,
  AccessLevel
} from '@mexit/core'

import { useAuthStore } from '../../Stores/useAuth'
import { useDataStore } from '../../Stores/useDataStore'
import '../../Utils/apiClient'

export const useNamespaceApi = () => {
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const { setNamespaces, setIlinks, addInArchive } = useDataStore()

  const workspaceHeaders = () => ({
    [WORKSPACE_HEADER]: getWorkspaceId(),
    Accept: 'application/json, text/plain, */*'
  })

  const getAllNamespaces = async () => {
    const namespaces = await client
      .get(apiURLs.namespaces.getAll(), {
        headers: workspaceHeaders()
      })
      .then((d: any) => {
        // mog('namespaces all', d.data)
        return d.data.map((item: any) => {
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
        mog('Error fetching all namespaces', e)
        return undefined
      })

    if (namespaces) {
      const newILinks = namespaces.reduce((arr, { nodeHierarchy }) => {
        return [...arr, ...nodeHierarchy]
      }, [])
      mog('update namespaces and ILinks', { namespaces, newILinks })
      // SetILinks once middleware is integrated
      setNamespaces(namespaces.map((n) => n.ns))
      // TODO: Also set archive links
      setIlinks(newILinks)
    }
  }

  const getNamespace = async (id: string) => {
    const namespace = await client
      .get(apiURLs.namespaces.get(id), {
        headers: workspaceHeaders()
      })
      .then((d: any) => {
        mog('namespaces specific', { data: d.data, id })
        // return d.data?.nodeHierarchy

        return {
          id: d.data?.id,
          name: d.data?.name,
          icon: d.data?.metadata?.icon ?? undefined,
          nodeHierarchy: d.data?.nodeHierarchy,
          createdAt: d.data?.createdAt,
          updatedAt: d.data?.updatedAt,
          publicAccess: d.data?.publicAccess
        }
      })
      .catch((e) => {
        mog('Save error', e)
        return undefined
      })

    return namespace
  }

  const getPublicNamespaceAPI = async (namespaceID: string) => {
    const res = await client
      .get(apiURLs.namespaces.getPublic(namespaceID), {
        headers: workspaceHeaders()
      })
      .then((response: any) => {
        return response.data
      })
    return res
  }

  const makeNamespacePublic = async (namespaceID: string) => {
    const res = await client
      .patch(apiURLs.namespaces.makePublic(namespaceID), null, {
        headers: workspaceHeaders()
      })
      .then((response: any) => {
        return response.data
      })
    return res
  }

  const makeNamespacePrivate = async (namespaceID: string) => {
    const res = await client
      .patch(apiURLs.namespaces.makePrivate(namespaceID), null, {
        headers: workspaceHeaders()
      })
      .then((response: any) => {
        return response.data
      })
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
      const res = await client
        .post(apiURLs.namespaces.create, req, {
          headers: workspaceHeaders()
        })
        .then((d: any) => ({
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
      const res = await client
        .patch(
          apiURLs.namespaces.update,
          {
            type: 'NamespaceRequest',
            id,
            name
          },
          {
            headers: workspaceHeaders()
          }
        )
        .then(() => true)
      return res
    } catch (err) {
      throw new Error('Unable to update namespace')
    }
  }

  const changeNamespaceIcon = async (id: string, name: string, icon: MIcon) => {
    try {
      const res = await client
        .patch(
          apiURLs.namespaces.update,
          {
            type: 'NamespaceRequest',
            id,
            name,
            metadata: { icon }
          },
          {
            headers: workspaceHeaders()
          }
        )
        .then(() => icon)
      return res
    } catch (err) {
      throw new Error('Unable to update namespace icon')
    }
  }

  const shareNamespace = async (id: string, userIDs: string[], accessType: AccessLevel) => {
    try {
      const res = await client.post(
        apiURLs.namespaces.share,
        {
          type: 'SharedNamespaceRequest',
          namespaceID: id,
          userIDToAccessTypeMap: userIDs.reduce((acc, userID) => {
            acc[userID] = accessType
            return acc
          }, {} as Record<string, AccessLevel>)
        },
        {
          headers: workspaceHeaders()
        }
      )
      mog('Shared a namespace', { res })
      return res
    } catch (err) {
      throw new Error(`Unable to share namespace: ${err}`)
    }
  }

  const revokeNamespaceShare = async (id: string, userIDs: string[]) => {
    try {
      const res = await client.delete(apiURLs.namespaces.update, {
        data: {
          type: 'SharedNamespaceRequest',
          namespaceID: id,
          userIDs
        },
        headers: workspaceHeaders()
      })
      mog('revoke access users', res)
      return res
    } catch (err) {
      throw new Error(`Unable to revoke namespace access: ${err}`)
    }
  }

  const updateNamespaceShare = async (id: string, userIDToAccessTypeMap: { [userid: string]: AccessLevel }) => {
    try {
      const payload = {
        namespaceID: id,
        userIDToAccessTypeMap
      }
      return await client
        .post(apiURLs.namespaces.share, payload, {
          headers: workspaceHeaders()
        })
        .then((resp) => {
          mog('changeUsers resp', { resp })
          return resp
        })
    } catch (err) {
      throw new Error(`Unable to update namespace access: ${err}`)
    }
  }

  const getAllSharedUsers = async (id: string): Promise<{ users: Record<string, string> }> => {
    try {
      return await client
        .get(apiURLs.namespaces.getUsersOfShared(id), {
          headers: workspaceHeaders()
        })
        .then((resp: any) => {
          mog('get all shared users', resp)
          return { users: resp.data }
        })
    } catch (err) {
      mog(`Unable to get shared namespace users: ${err}`)
      return { users: {} }
    }
  }

  return {
    createNewNamespace,
    getAllNamespaces,
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
