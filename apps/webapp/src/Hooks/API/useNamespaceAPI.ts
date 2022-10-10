import toast from 'react-hot-toast'

import { client } from '@workduck-io/dwindle'

import { apiURLs, generateNamespaceId, runBatch, iLinksToUpdate, MIcon, mog, WORKSPACE_HEADER } from '@mexit/core'

import { useAuthStore } from '../../Stores/useAuth'
import { useDataStore } from '../../Stores/useDataStore'
import '../../Utils/apiClient'

export const useNamespaceApi = () => {
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const { setNamespaces, addInArchive } = useDataStore()

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
        mog('namespaces all', d.data)
        return d.data.map((item: any) => ({
          ns: {
            id: item.namespaceID,
            name: item.namespaceTitle,
            icon: item.namespaceMetadata?.metadata?.icon ?? undefined,
            createdAt: item.metadata?.createdAt,
            updatedAt: item.metadata?.updatedAt
          },
          archiveHierarchy: item?.archivedNodeHierarchyInformation
        }))
      })
      .catch((e) => {
        mog('Save error', e)
        return undefined
      })

    if (namespaces) {
      const updatedILinks = (
        await runBatch([
          ...namespaces.map(async ({ ns }) => {
            const nsDetails = await getNamespace(ns.id)
            mog('nsDetails', { nsDetails })
            return nsDetails
          })
        ])
      ).fulfilled

      mog('updatedILinks', { updatedILinks })
      const newILinks = updatedILinks[0]
        .filter((p) => p.status === 'fulfilled')
        .map((p) => p.value)
        .reduce((arr, ns) => {
          // mog('ns', { ns })
          return [...arr, ...ns.nodeHierarchy]
        }, [])

      mog('updatedILinks', { updatedILinks, newILinks })
      setNamespaces(namespaces.map((n) => n.ns))
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
          icon: d.data?.namespaceMetadata?.metadata?.icon ?? undefined,
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

  const createNewNamespace = async (name: string) => {
    try {
      const res = await client
        .post(
          apiURLs.namespaces.create,
          {
            type: 'NamespaceRequest',
            name,
            id: generateNamespaceId(),
            metadata: {
              iconUrl: 'heroicons-outline:view-grid'
            }
          },
          {
            headers: workspaceHeaders()
          }
        )
        .then((d: any) => ({
          id: d?.data?.id,
          name: d?.data?.name,
          iconUrl: d?.data?.metadata?.iconUrl,
          createdAt: d?.data?.createdAt,
          updatedAt: d?.data?.updatedAt
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
            metadata: {
              icon
            }
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

  return {
    createNewNamespace,
    getAllNamespaces,
    changeNamespaceName,
    changeNamespaceIcon
  }
}
