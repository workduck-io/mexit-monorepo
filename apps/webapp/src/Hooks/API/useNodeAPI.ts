import toast from 'react-hot-toast'

import { client } from '@workduck-io/dwindle'

import {
  defaultContent,
  apiURLs,
  mog,
  SEPARATOR,
  extractMetadata,
  removeNulls,
  WORKSPACE_HEADER,
  DEFAULT_NAMESPACE,
  GET_REQUEST_MINIMUM_GAP,
  runBatch,
  iLinksToUpdate,
  hierarchyParser,
  generateNamespaceId,
  MIcon
} from '@mexit/core'

import { isRequestedWithin } from '../../Stores/useApiStore'
import { useAuthStore } from '../../Stores/useAuth'
import { useContentStore } from '../../Stores/useContentStore'
import { useDataStore } from '../../Stores/useDataStore'
import '../../Utils/apiClient'
import { deserializeContent, serializeContent } from '../../Utils/serializer'
import { useInternalLinks } from '../useInternalLinks'
import { getTitleFromPath, useLinks } from '../useLinks'
import { useNodes } from '../useNodes'
import { useTags } from '../useTags'
import { useUpdater } from '../useUpdater'

interface SnippetResponse {
  snippetID: string
  title: string
  version: number
}

interface SnippetMetadata {
  id: string
  title: string
  icon: string
}

export const useApi = () => {
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const setMetadata = useContentStore((store) => store.setMetadata)
  const setContent = useContentStore((store) => store.setContent)
  const { getTags } = useTags()
  const { getPathFromNodeid, getNodePathAndTitle, getNodeParentIdFromPath } = useLinks()
  const { updateILinksFromAddedRemovedPaths, createNoteHierarchyString } = useInternalLinks()
  const { setNodePublic, setNodePrivate, checkNodePublic, setNamespaces, addInArchive } = useDataStore()
  const { updateFromContent } = useUpdater()

  const { getSharedNode } = useNodes()

  const workspaceHeaders = () => ({
    [WORKSPACE_HEADER]: getWorkspaceId(),
    Accept: 'application/json, text/plain, */*'
  })

  /*
   * Saves new node data in the backend
   * Also updates the incoming data in the store
   */

  const saveSingleNewNode = async (
    nodeid: string,
    path: string,
    referenceID?: string,
    content?: any[] // eslint-disable-line
  ) => {
    const reqData = {
      id: nodeid,
      title: getTitleFromPath(path),
      referenceID: referenceID,
      data: serializeContent(content ?? defaultContent.content, nodeid)
    }

    setContent(nodeid, content ?? defaultContent.content)

    const data = await client
      .post(apiURLs.createNode, reqData, {
        headers: workspaceHeaders()
      })
      .then((d: any) => {
        setMetadata(nodeid, extractMetadata(d.data))
        return d.data
      })
      .catch((e) => {
        console.error(e)
      })

    return data
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bulkCreateNodes = async (nodeid: string, namespace: string, path: string, content?: any[]) => {
    const noteHierarchyString = createNoteHierarchyString(path)
    mog('BulkCreateNoteHierarchyString', { noteHierarchyString })
    const reqData = {
      nodePath: {
        path: noteHierarchyString,
        namespaceID: namespace
      },
      id: nodeid,
      title: getTitleFromPath(path),
      data: serializeContent(content ?? defaultContent.content, nodeid),
      namespaceID: namespace,
      tags: getTags(nodeid)
    }

    setContent(nodeid, content ?? defaultContent.content)

    const data = await client
      .post(apiURLs.bulkCreateNodes, reqData, {
        headers: workspaceHeaders()
      })
      .then((d: any) => {
        mog('d', { d })
        // const { addedILinks, removedILinks, node } = d.data
        // setMetadata(nodeid, extractMetadata(node))
        // updateILinksFromAddedRemovedPaths(addedILinks, removedILinks)
        // return node
      })

    return data
  }

  const saveNewNodeAPI = async (nodeid: string, namespace: string, path?: string) => {
    if (!path) path = getPathFromNodeid(nodeid)

    const paths = path.split(SEPARATOR)
    console.log('Sendin this path to the API: ', path)

    const reqData = {
      nodePath: {
        path: paths.join('#')
      },
      id: nodeid,
      title: paths.slice(-1)[0],
      type: 'NodeBulkRequest',
      namespaceIdentifier: namespace,
      data: serializeContent(defaultContent.content, nodeid)
    }

    setContent(nodeid, defaultContent.content)

    const data = await client
      .post(apiURLs.bulkCreateNodes, reqData, {
        headers: workspaceHeaders()
      })
      .then((d: any) => {
        const { addedILinks, removedILinks } = d.data
        setMetadata(nodeid, extractMetadata(d.data))
        updateILinksFromAddedRemovedPaths(addedILinks, removedILinks)
        return d.data
      })
      .catch((e) => {
        console.error(e)
      })

    return data
  }

  /*
   * Saves data in the backend
   * Also updates the incoming data in the store
   */
  const saveDataAPI = async (
    nodeid: string,
    namespace: string,
    content: any[],
    isShared = false,
    updatedPath?: string
  ) => {
    const { title, path } = getNodePathAndTitle(nodeid)
    const reqData = {
      id: nodeid,
      title: updatedPath?.split(SEPARATOR).slice(-1)[0] ?? title,
      namespaceID: namespace,
      data: serializeContent(content ?? defaultContent.content, nodeid),
      tags: getTags(nodeid)
    }

    const parentNodeId = getNodeParentIdFromPath(path)
    if (parentNodeId) reqData['referenceID'] = parentNodeId

    if (isShared) {
      const node = getSharedNode(nodeid)
      if (node.currentUserAccess[nodeid] === 'READ') return
    }

    const url = isShared ? apiURLs.updateSharedNode : apiURLs.createNode

    const data = await client
      .post(url, reqData, {
        headers: workspaceHeaders()
      })
      .then((d) => {
        mog('savedData', { d })
        setMetadata(nodeid, extractMetadata(d.data))
        return d.data
      })
      .catch((e) => {
        console.error(e)
      })
    return data
  }

  const getDataAPI = async (nodeid: string, isShared = false, isRefresh = false, isUpdate = true) => {
    const url = isShared ? apiURLs.getSharedNode(nodeid) : apiURLs.getNode(nodeid)
    mog('GetNodeOptions', { isShared, url })
    if (!isShared && isRequestedWithin(GET_REQUEST_MINIMUM_GAP, url) && !isRefresh) {
      console.warn('\nAPI has been requested before, cancelling\n')
      return
    }

    const res = await client
      .get(url, {
        headers: workspaceHeaders()
      })
      .then((d: any) => {
        const content = deserializeContent(d.data.data)
        if (isUpdate) updateFromContent(nodeid, content)

        return { data: d.data.data, metadata: extractMetadata(d.data.data[0]), version: d.data.version ?? undefined }
      })
      .catch((e) => {
        console.error(`MexError: Fetching nodeid ${nodeid} failed with: `, e)
      })

    if (res) {
      return { content: deserializeContent(res.data), metadata: res.metadata ?? undefined, version: res.version }
    }
  }

  const makeNotePublic = async (nodeId: string) => {
    const URL = apiURLs.makeNotePublic(nodeId)
    return await client
      .patch(URL, null, {
        withCredentials: false,
        headers: workspaceHeaders()
      })
      .then((resp) => {
        setNodePublic(nodeId)
        return nodeId
      })

      .catch((error) => {
        mog('makeNotePublicError', { error })
      })
  }

  const makeNotePrivate = async (nodeId: string) => {
    const URL = apiURLs.makeNotePrivate(nodeId)

    return await client
      .patch(URL, null, {
        withCredentials: false,
        headers: workspaceHeaders()
      })
      .then((resp) => {
        setNodePrivate(nodeId)
        return nodeId
      })
      .catch((error) => {
        mog('makeNotePrivateError', { error })
      })
  }

  const getPublicNodeAPI = async (nodeId: string) => {
    const res = await client
      .get(apiURLs.getPublicNode(nodeId), {
        headers: {
          Accept: 'application/json, text/plain, */*'
        }
      })
      .then((d: any) => {
        const metadata = {
          createdBy: d.data.createdBy,
          createdAt: d.data.createdAt,
          lastEditedBy: d.data.lastEditedBy,
          updatedAt: d.data.updatedAt
        }

        // console.log(metadata, d.data)
        return {
          title: d.data.title,
          data: d.data.data,
          metadata: removeNulls(metadata),
          version: d.data.version ?? undefined
        }
      })

    if (res) {
      return {
        id: nodeId,
        title: res.title ?? '',
        content: deserializeContent(res.data),
        metadata: res.metadata ?? undefined,
        version: res.version
      }
    }
  }

  const isPublic = (nodeid: string) => {
    return checkNodePublic(nodeid)
  }

  const saveSnippetAPI = async ({
    snippetId,
    snippetTitle,
    content,
    template
  }: {
    snippetId: string
    snippetTitle: string
    content: any[]
    template?: boolean
  }) => {
    const reqData = {
      id: snippetId,
      type: 'SnippetRequest',
      title: snippetTitle,
      namespaceIdentifier: DEFAULT_NAMESPACE,
      data: serializeContent(content ?? defaultContent.content, snippetId),
      template: template ?? false
    }

    const data = await client
      .post(apiURLs.createSnippet, reqData, {
        headers: workspaceHeaders()
      })
      .then((d) => {
        mog('savedData', { d })
        setMetadata(snippetId, extractMetadata(d.data))
        return d.data
      })
      .catch((e) => {
        console.error(e)
      })
    return data
  }

  const getAllSnippetsByWorkspace = async (): Promise<SnippetMetadata[]> => {
    const data = await client
      .get(apiURLs.getAllSnippetsByWorkspace, {
        headers: workspaceHeaders()
      })
      .then((d) => {
        const snippetResp = d.data as SnippetResponse[]
        return snippetResp.map((item) => {
          return {
            id: item.snippetID,
            title: item.title,
            icon: 'ri:quill-pen-line'
          }
        })
      })

    return data
  }

  const getSnippetById = async (id: string) => {
    const url = apiURLs.getSnippetById(id)

    const data = await client
      .get(url, {
        headers: workspaceHeaders()
      })
      .then((d) => {
        mog('snippet by id', { d })
        return d.data
      })

    return data
  }

  const refactorHeirarchy = async (
    existingNodePath: { path: string; namespaceID?: string },
    newNodePath: { path: string; namespaceID?: string },
    nodeId: string
  ) => {
    const reqData = {
      existingNodePath,
      newNodePath,
      nodeID: nodeId
    }
    const data = await client
      .post(apiURLs.refactorHeirarchy, reqData, {
        headers: workspaceHeaders()
      })
      .then((response) => {
        mog('refactor', response.data)
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })

    return data as any
  }

  const getAllNamespaces = async () => {
    const namespaces = await client
      .get(apiURLs.namespaces.getAll, {
        headers: workspaceHeaders()
      })
      .then((d) => {
        mog('namespaces all', d.data)
        return d.data.map((item: any) => ({
          ns: {
            id: item.id,
            name: item.name,
            icon: item.namespaceMetadata?.icon ?? undefined,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
          },
          archiveHierarchy: item.archivedNodeHierarchyInformation
        }))
      })
      .catch((e) => {
        mog('Save error', e)
        return undefined
      })

    if (namespaces) {
      setNamespaces(namespaces.map((n) => n.ns))
      namespaces.map((n) => {
        const archivedNotes = hierarchyParser(n.archiveHierarchy, n.ns.id, {
          withParentNodeId: true,
          allowDuplicates: true
        })

        if (archivedNotes && archivedNotes.length > 0) {
          const localILinks = useDataStore.getState().archive
          const { toUpdateLocal } = iLinksToUpdate(localILinks, archivedNotes)

          mog('toUpdateLocal', { n, toUpdateLocal, archivedNotes })

          runBatch(
            toUpdateLocal.map((ilink) =>
              getDataAPI(ilink.nodeid, false, false, false).then((data) => {
                mog('toUpdateLocal', { ilink, data })
                setContent(ilink.nodeid, data.content, data.metadata)
                updateDocument('archive', ilink.nodeid, data.content)
              })
            )
          ).then(() => {
            addInArchive(archivedNotes)
          })
        }
      })
    }
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
    saveDataAPI,
    getDataAPI,
    bulkCreateNodes,
    saveSingleNewNode,
    saveNewNodeAPI,
    makeNotePublic,
    makeNotePrivate,
    isPublic,
    getPublicNodeAPI,
    saveSnippetAPI,
    getAllSnippetsByWorkspace,
    getSnippetById,
    refactorHeirarchy,
    createNewNamespace,
    getAllNamespaces,
    changeNamespaceName,
    changeNamespaceIcon
  }
}
