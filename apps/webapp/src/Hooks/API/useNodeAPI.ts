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
  hierarchyParser
} from '@mexit/core'

import { useAuthStore } from '../../Stores/useAuth'
import { isRequestedWithin } from '../../Stores/useApiStore'
import { deserializeContent, serializeContent } from '../../Utils/serializer'
import { useInternalLinks } from '../useInternalLinks'
import { useContentStore } from '../../Stores/useContentStore'
import { useDataStore } from '../../Stores/useDataStore'
import { useLinks } from '../useLinks'
import { useTags } from '../useTags'
import { useNodes } from '../useNodes'
import { useUpdater } from '../useUpdater'
import '../../Utils/apiClient'

export const useApi = () => {
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const setMetadata = useContentStore((store) => store.setMetadata)
  const setContent = useContentStore((store) => store.setContent)
  const { getTags } = useTags()
  const { getPathFromNodeid, getTitleFromPath, getNodePathAndTitle, getNodeParentIdFromPath } = useLinks()
  const { updateILinksFromAddedRemovedPaths, createNoteHierarchyString } = useInternalLinks()
  const { setNodePublic, setNodePrivate, checkNodePublic } = useDataStore(
    ({ setNodePublic, setNodePrivate, checkNodePublic }) => ({
      setNodePublic,
      setNodePrivate,
      checkNodePublic
    })
  )
  const { updateFromContent } = useUpdater()
  const setIlinks = useDataStore((store) => store.setIlinks)

  const { getSharedNode } = useNodes()

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
        headers: {
          [WORKSPACE_HEADER]: getWorkspaceId(),
          Accept: 'application/json, text/plain, */*'
        }
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
  const bulkCreateNodes = async (nodeid: string, path: string, content?: any[]) => {
    const noteHierarchyString = createNoteHierarchyString(path)
    mog('BulkCreateNoteHierarchyString', { noteHierarchyString })
    const reqData = {
      nodePath: {
        path: noteHierarchyString
      },
      id: nodeid,
      title: getTitleFromPath(path),
      data: serializeContent(content ?? defaultContent.content, nodeid),
      namespaceIdentifier: DEFAULT_NAMESPACE,
      tags: getTags(nodeid)
    }

    setContent(nodeid, content ?? defaultContent.content)

    const data = await client
      .post(apiURLs.bulkCreateNodes, reqData, {
        headers: {
          [WORKSPACE_HEADER]: getWorkspaceId()
        }
      })
      .then((d: any) => {
        const { addedILinks, removedILinks, node } = d.data
        setMetadata(nodeid, extractMetadata(node))
        updateILinksFromAddedRemovedPaths(addedILinks, removedILinks)
        return node
      })

    return data
  }

  const saveNewNodeAPI = async (nodeid: string, path?: string) => {
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
      namespaceIdentifier: 'NAMESPACE1',
      data: serializeContent(defaultContent.content, nodeid)
    }

    setContent(nodeid, defaultContent.content)

    const data = await client
      .post(apiURLs.bulkCreateNodes, reqData, {
        headers: {
          [WORKSPACE_HEADER]: getWorkspaceId(),
          Accept: 'application/json, text/plain, */*'
        }
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
  const saveDataAPI = async (nodeid: string, content: any[], isShared = false) => {
    const { title, path } = getNodePathAndTitle(nodeid)
    const reqData = {
      id: nodeid,
      title: title,
      namespaceIdentifier: DEFAULT_NAMESPACE,
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
        headers: {
          [WORKSPACE_HEADER]: getWorkspaceId(),
          Accept: 'application/json, text/plain, */*'
        }
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

  const getDataAPI = async (nodeid: string, isShared = false) => {
    const url = isShared ? apiURLs.getSharedNode(nodeid) : apiURLs.getNode(nodeid)
    mog('GetNodeOptions', { isShared, url })
    if (!isShared && isRequestedWithin(GET_REQUEST_MINIMUM_GAP, url)) {
      console.warn('\nAPI has been requested before, cancelling\n')
      return
    }

    const res = await client
      .get(url, {
        headers: {
          [WORKSPACE_HEADER]: getWorkspaceId(),
          Accept: 'application/json, text/plain, */*'
        }
      })
      .then((d: any) => {
        const content = deserializeContent(d.data.data)
        updateFromContent(nodeid, content)

        return { data: d.data.data, metadata: extractMetadata(d.data.data[0]), version: d.data.version ?? undefined }
      })
      .catch((e) => {
        console.error(`MexError: Fetching nodeid ${nodeid} failed with: `, e)
      })

    if (res) {
      return { content: deserializeContent(res.data), metadata: res.metadata ?? undefined, version: res.version }
    }
  }

  const getNodesByWorkspace = async () => {
    const data = await client
      .get(apiURLs.getHierarchy, {
        headers: {
          [WORKSPACE_HEADER]: getWorkspaceId(),
          Accept: 'application/json, text/plain, */*'
        }
      })
      .then((d) => {
        if (d.data) {
          const nodes = hierarchyParser(d.data as any)
          if (nodes && nodes.length > 0) {
            const localILinks = useDataStore.getState().ilinks
            const { toUpdateLocal } = iLinksToUpdate(localILinks, nodes)

            runBatch(toUpdateLocal.map((ilink) => getDataAPI(ilink.nodeid)))

            setIlinks(nodes)
            // ipcRenderer.send(IpcAction.UPDATE_ILINKS, { ilinks: nodes })
          }

          return d.data
        }
      })

    return data
  }

  const makeNodePublic = async (nodeId: string) => {
    const URL = apiURLs.makeNodePublic(nodeId)
    return await client
      .patch(URL, null, {
        withCredentials: false,
        headers: {
          'mex-workspace-id': getWorkspaceId(),
          Accept: 'application/json, text/plain, */*'
        }
      })
      .then((resp) => {
        const publicURL = apiURLs.getNodePublicURL(nodeId)
        setNodePublic(nodeId, publicURL)
        return nodeId
      })

      .catch((error) => {
        mog('MakeNodePublicError', { error })
      })
  }

  const makeNodePrivate = async (nodeId: string) => {
    const URL = apiURLs.makeNodePrivate(nodeId)

    return await client
      .patch(URL, null, {
        withCredentials: false,
        headers: {
          'mex-workspace-id': getWorkspaceId()
        }
      })
      .then((resp) => {
        setNodePrivate(nodeId)
        return nodeId
      })
      .catch((error) => {
        mog('MakeNodePrivateError', { error })
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

  const saveSnippetAPI = async (snippetId: string, snippetTitle: string, content: any[]) => {
    const reqData = {
      id: snippetId,
      type: 'SnippetRequest',
      title: snippetTitle,
      namespaceIdentifier: DEFAULT_NAMESPACE,
      data: serializeContent(content ?? defaultContent.content, snippetId)
    }

    const data = await client
      .post(apiURLs.createSnippet, reqData, {
        headers: {
          [WORKSPACE_HEADER]: getWorkspaceId(),
          Accept: 'application/json, text/plain, */*'
        }
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
        headers: {
          [WORKSPACE_HEADER]: getWorkspaceId(),
          Accept: 'application/json, text/plain, */*'
        }
      })
      .then((d) => {
        return d.data
      })

    return data
  }

  const getSnippetById = async (id: string) => {
    const url = apiURLs.getSnippetById(id)

    const data = await client
      .get(url, {
        headers: {
          [WORKSPACE_HEADER]: getWorkspaceId(),
          Accept: 'application/json, text/plain, */*'
        }
      })
      .then((d) => {
        mog('snippet by id', { d })
        return d.data
      })

    return data
  }

  const refactorHeirarchy = async (
    existingNodePath: { path: string; namespaceId?: string },
    newNodePath: { path: string; namespaceId?: string },
    nodeId: string
  ) => {
    const reqData = {
      existingNodePath,
      newNodePath,
      nodeID: nodeId
    }
    const data = await client
      .post(apiURLs.refactorHeirarchy, reqData, {
        headers: {
          [WORKSPACE_HEADER]: getWorkspaceId(),
          Accept: 'application/json, text/plain, */*'
        }
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

  return {
    saveDataAPI,
    getDataAPI,
    bulkCreateNodes,
    saveSingleNewNode,
    saveNewNodeAPI,
    getNodesByWorkspace,
    makeNodePublic,
    makeNodePrivate,
    isPublic,
    getPublicNodeAPI,
    saveSnippetAPI,
    getAllSnippetsByWorkspace,
    getSnippetById,
    refactorHeirarchy
  }
}