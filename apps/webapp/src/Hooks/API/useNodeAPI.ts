import toast from 'react-hot-toast'

import { client } from '@workduck-io/dwindle'

import {
  defaultContent,
  apiURLs,
  mog,
  extractMetadata,
  removeNulls,
  WORKSPACE_HEADER,
  DEFAULT_NAMESPACE,
  GET_REQUEST_MINIMUM_GAP, // runBatch,
  iLinksToUpdate,
  generateNamespaceId,
  MIcon,
  NodeEditorContent,
  getTagsFromContent
} from '@mexit/core'

import { isRequestedWithin } from '../../Stores/useApiStore'
import { useAuthStore } from '../../Stores/useAuth'
import { useContentStore } from '../../Stores/useContentStore'
import { useDataStore } from '../../Stores/useDataStore'
import '../../Utils/apiClient'
import { deserializeContent, serializeContent } from '../../Utils/serializer'
import { useInternalLinks } from '../useInternalLinks'
import { useLinks } from '../useLinks'
import { useNodes } from '../useNodes'
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
  const { getTitleFromNoteId } = useLinks()
  const { updateILinksFromAddedRemovedPaths } = useInternalLinks()
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
    noteID: string,
    namespaceID: string,
    options?: {
      path: string
      parentNoteId: string
      content: NodeEditorContent
    }
  ) => {
    const reqData = {
      id: noteID,
      title: getTitleFromNoteId(noteID),
      referenceID: options?.parentNoteId,
      namespaceID: namespaceID,
      data: serializeContent(options.content ?? defaultContent.content, noteID),
      tags: getTagsFromContent(options.content)
    }

    setContent(noteID, options.content ?? defaultContent.content)

    const data = await client
      .post(apiURLs.createNode, reqData, {
        headers: workspaceHeaders()
      })
      .then((d: any) => {
        const metadata = extractMetadata(d.data)
        updateFromContent(noteID, d.data ?? options.content, metadata)
        return d.data
      })
      .catch((e) => {
        console.error(e)
      })

    return data
  }

  const bulkCreateNodes = async (
    noteID: string,
    namespaceID: string,
    options: {
      path: string
      content: NodeEditorContent
    }
  ) => {
    options.content = options.content ?? defaultContent.content
    const reqData = {
      nodePath: {
        path: options.path,
        namespaceID: namespaceID
      },
      title: getTitleFromNoteId(noteID),
      namespaceID: namespaceID,
      tags: getTagsFromContent(options.content),
      data: serializeContent(options.content, noteID)
    }

    setContent(noteID, options.content)

    const data = await client
      .post(apiURLs.bulkCreateNodes, reqData, {
        headers: workspaceHeaders()
      })
      .then((d: any) => {
        const addedILinks = []
        const removedILinks = []
        const { changedPaths, node } = d.data
        Object.entries(changedPaths).forEach(([nsId, changed]: [string, any]) => {
          const { addedPaths: nsAddedILinks, removedPaths: nsRemovedILinks } = changed
          addedILinks.push(...nsAddedILinks)
          removedILinks.push(...nsRemovedILinks)
        })

        updateILinksFromAddedRemovedPaths(addedILinks, removedILinks)
        setMetadata(noteID, extractMetadata(node))
      })

    return data
  }

  /*
   * Saves data in the backend
   * Also updates the incoming data in the store
   */
  const saveDataAPI = async (
    noteID: string,
    namespaceID: string,
    content: NodeEditorContent,
    isShared = false,
    title?: string
  ) => {
    const reqData = {
      id: noteID,
      title: title || getTitleFromNoteId(noteID),
      namespaceID: namespaceID,
      tags: getTagsFromContent(content),
      data: serializeContent(content ?? defaultContent.content, noteID)
    }

    if (isShared) {
      const node = getSharedNode(noteID)
      if (node.currentUserAccess[noteID] === 'READ') return
    }

    const url = isShared ? apiURLs.updateSharedNode : apiURLs.createNode
    const data = await client
      .post(url, reqData, {
        headers: workspaceHeaders()
      })
      .then((d) => {
        setMetadata(noteID, extractMetadata(d.data))
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
  const refactorHierarchy = async (
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

    return data
  }

  const getAllNamespaces = async () => {
    const namespaces = await client
      .get(apiURLs.namespaces.getAll, {
        headers: workspaceHeaders()
      })
      .then((d: any) => {
        mog('namespaces all', d.data)
        return d.data.map((item: any) => ({
          ns: {
            id: item.id,
            name: item.name,
            icon: item.namespaceMetadata?.icon ?? undefined,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
          },
          archiveHierarchy: item?.archivedNodeHierarchyInformation
        }))
      })
      .catch((e) => {
        mog('Save error', e)
        return undefined
      })

    if (namespaces) {
      setNamespaces(namespaces.map((n) => n.ns))
      namespaces.map((n) => {
        const archivedILinks = n?.archivedNodeHierarchyInformation

        if (archivedILinks && archivedILinks.length > 0) {
          const localILinks = useDataStore.getState().archive
          const { toUpdateLocal } = iLinksToUpdate(localILinks, archivedILinks)

          mog('toUpdateLocal', { n, toUpdateLocal, archivedILinks })
          addInArchive(archivedILinks)
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
    makeNotePublic,
    makeNotePrivate,
    isPublic,
    getPublicNodeAPI,
    saveSnippetAPI,
    getAllSnippetsByWorkspace,
    getSnippetById,
    refactorHierarchy,
    createNewNamespace,
    getAllNamespaces,
    changeNamespaceName,
    changeNamespaceIcon
  }
}
