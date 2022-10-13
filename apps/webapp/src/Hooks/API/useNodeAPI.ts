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
  getTagsFromContent,
  hierarchyParser
} from '@mexit/core'

import { isRequestedWithin, RequestData, useApiStore } from '../../Stores/useApiStore'
import { useAuthStore } from '../../Stores/useAuth'
import { useContentStore } from '../../Stores/useContentStore'
import { useDataStore } from '../../Stores/useDataStore'
import { useSnippetStore } from '../../Stores/useSnippetStore'
import '../../Utils/apiClient'
import { deserializeContent, serializeContent } from '../../Utils/serializer'
import { WorkerRequestType } from '../../Utils/worker'
import { runBatchWorker } from '../../Workers/controller'
import { useInternalLinks } from '../useInternalLinks'
import { useLinks } from '../useLinks'
import { useNodes } from '../useNodes'
import { useSearch } from '../useSearch'
import { useUpdater } from '../useUpdater'
import { useAPIHeaders } from './useAPIHeaders'

export const useApi = () => {
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const setMetadata = useContentStore((store) => store.setMetadata)
  const setContent = useContentStore((store) => store.setContent)
  const { getTitleFromNoteId } = useLinks()
  const { updateILinksFromAddedRemovedPaths } = useInternalLinks()
  const { setNodePublic, setNodePrivate, checkNodePublic, setNamespaces, addInArchive } = useDataStore()
  const { updateFromContent } = useUpdater()
  const setILinks = useDataStore((store) => store.setIlinks)
  const { getSharedNode } = useNodes()
  const { updateDocument, removeDocument } = useSearch()
  const initSnippets = useSnippetStore((store) => store.initSnippets)
  const updateSnippet = useSnippetStore((store) => store.updateSnippet)

  const setRequest = useApiStore.getState().setRequest

  const { workspaceHeaders } = useAPIHeaders()

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
        const content = deserializeContent(d.data.data ?? options.content)
        updateFromContent(noteID, content, metadata)
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
      id: noteID,
      title: getTitleFromNoteId(noteID),
      namespaceID: namespaceID,
      tags: getTagsFromContent(options.content),
      data: serializeContent(options.content, noteID)
    }
    mog('BulkCreateNodes', { reqData, noteID, namespaceID, options })
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

  const appendToNode = async (noteId: string, content: NodeEditorContent, options?: { isShared?: boolean }) => {
    const reqData = {
      type: 'ElementRequest',
      elements: serializeContent(content, noteId)
    }

    // * TODO: Add append to Note for shared notes
    const url = apiURLs.appendNode(noteId)

    const res = await client.patch(url, reqData, { headers: workspaceHeaders() })

    if (res?.data) {
      // toast('Task added!')
    }
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
      reqData['namespaceID'] = undefined
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
    if (!isShared && isRequestedWithin(GET_REQUEST_MINIMUM_GAP, url) && !isRefresh) {
      console.warn('\nAPI has been requested before, cancelling\n')
      return
    }

    const res = await client
      .get(url, {
        headers: workspaceHeaders()
      })
      .then((d: any) => {
        if (d) {
          const content = deserializeContent(d.data.data)
          if (isUpdate) updateFromContent(nodeid, content)

          return { data: d.data.data, metadata: extractMetadata(d.data), version: d.data.version ?? undefined }
        }
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

  const getAllSnippetsByWorkspace = async () => {
    const data = await client
      .get(apiURLs.getAllSnippetsByWorkspace, {
        headers: workspaceHeaders()
      })
      .then((d) => {
        return d.data
      })
      .then((d: any) => {
        const snippets = useSnippetStore.getState().snippets

        const newSnippets = d.filter((snippet) => {
          const existSnippet = snippets.find((s) => s.id === snippet.snippetID)
          return existSnippet === undefined
        })

        initSnippets([
          ...snippets,
          ...newSnippets.map((item) => ({
            icon: 'ri:quill-pen-line',
            id: item.snippetID,
            template: item.template,
            title: item.title,
            content: []
          }))
        ])

        return newSnippets
      })
      .then(async (newSnippets) => {
        const ids = newSnippets?.map((item) => item.snippetID)
        mog('NewSnippets', { newSnippets, ids })

        if (ids && ids.length > 0) {
          const res = await runBatchWorker(WorkerRequestType.GET_SNIPPETS, 6, ids)
          const requestData = { time: Date.now(), method: 'GET' }

          res.fulfilled.forEach(async (snippet) => {
            setRequest(apiURLs.getSnippetById(snippet.id), { ...requestData, url: apiURLs.getSnippetById(snippet.id) })
            if (snippet) {
              updateSnippet(snippet.id, snippet)
              const isTemplate = snippet.template ?? false

              const tags = isTemplate ? ['template'] : ['snippet']
              const idxName = isTemplate ? 'template' : 'snippet'

              if (isTemplate) {
                await removeDocument('snippet', snippet.id)
              } else {
                await removeDocument('template', snippet.id)
              }

              await updateDocument(idxName, snippet.id, snippet.content, snippet.title, tags)
            }
          })

          mog('RunBatchWorkerSnippetsRes', { res, ids })
        }
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
          const ids = toUpdateLocal.map((i) => i.nodeid)
          const requestData = { time: Date.now(), method: 'GET' }
          runBatchWorker(WorkerRequestType.GET_NODES, 6, ids)
            .then((res) => {
              const { fulfilled } = res

              fulfilled.forEach((node) => {
                const { rawResponse, nodeid } = node
                setRequest(apiURLs.getNode(nodeid), { ...requestData, url: apiURLs.getNode(nodeid) })
                const content = deserializeContent(rawResponse.data)
                setContent(nodeid, content, extractMetadata(rawResponse))
                updateDocument('archive', nodeid, content)
              })
            })
            .then(() => {
              addInArchive(archivedILinks)
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

  const getNodesByWorkspace = async () => {
    const updatedILinks: any[] = await client
      .get(apiURLs.namespaces.getHierarchy, {
        headers: {
          'mex-workspace-id': getWorkspaceId()
        }
      })
      .then((res: any) => {
        return res.data
      })
      .catch(console.error)

    mog(`UpdatedILinks`, { updatedILinks })

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
    if (nodes && nodes.length > 0) {
      const localILinks = useDataStore.getState().ilinks
      const { toUpdateLocal } = iLinksToUpdate(localILinks, nodes)
      const ids = toUpdateLocal.map((i) => i.nodeid)

      const { fulfilled } = await runBatchWorker(WorkerRequestType.GET_NODES, 6, ids)
      const requestData = { time: Date.now(), method: 'GET' }

      fulfilled.forEach((node) => {
        const { rawResponse, nodeid } = node
        setRequest(apiURLs.getNode(nodeid), { ...requestData, url: apiURLs.getNode(nodeid) })
        const content = deserializeContent(rawResponse.data)
        const metadata = extractMetadata(rawResponse) // added by Varshitha
        updateFromContent(nodeid, content, metadata)
      })
    }

    // setNamespaces(namespaces)
    setILinks(nodes)
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
    appendToNode,
    saveSnippetAPI,
    getAllSnippetsByWorkspace,
    getSnippetById,
    refactorHierarchy,
    createNewNamespace,
    getAllNamespaces,
    changeNamespaceName,
    changeNamespaceIcon,
    getNodesByWorkspace,
    getPublicNamespaceAPI
  }
}
