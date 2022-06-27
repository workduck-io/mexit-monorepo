import { client } from '@workduck-io/dwindle'

import { defaultContent, apiURLs, mog, SEPARATOR, extractMetadata, removeNulls } from '@mexit/core'

import { useAuthStore } from '../Stores/useAuth'
import { WORKSPACE_HEADER, DEFAULT_NAMESPACE, GET_REQUEST_MINIMUM_GAP } from '@mexit/core'
import { isRequestedWithin } from '../Stores/useApiStore'
import '../Utils/apiClient'
import { deserializeContent, serializeContent } from '../Utils/serializer'
import { useInternalLinks } from './useInternalLinks'
import { useContentStore } from '../Stores/useContentStore'
import { useDataStore } from '../Stores/useDataStore'
import { useLinks } from './useLinks'
import { useTags } from './useTags'

export const useApi = () => {
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const setMetadata = useContentStore((store) => store.setMetadata)
  const setContent = useContentStore((store) => store.setContent)
  const userDetails = useAuthStore((store) => store.userDetails)
  const { getTags } = useTags()
  const { getPathFromNodeid, getNodeidFromPath, getTitleFromPath } = useLinks()
  const { updateILinksFromAddedRemovedPaths, createNoteHierarchyString } = useInternalLinks()
  const { setNodePublic, setNodePrivate, checkNodePublic } = useDataStore(
    ({ setNodePublic, setNodePrivate, checkNodePublic }) => ({
      setNodePublic,
      setNodePrivate,
      checkNodePublic
    })
  )

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
      lastEditedBy: useAuthStore.getState().userDetails.email,
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
  const saveDataAPI = async (nodeid: string, content: any[], nodePath?: string) => {
    const path = nodePath?.split(SEPARATOR) || getPathFromNodeid(nodeid).split(SEPARATOR)
    const reqData = {
      id: nodeid,
      title: path.slice(-1)[0],
      lastEditedBy: useAuthStore.getState().userDetails.email,
      namespaceIdentifier: DEFAULT_NAMESPACE,
      data: serializeContent(content ?? defaultContent.content, nodeid),
      tags: getTags(nodeid)
    }

    if (path.length > 1) {
      reqData['referenceID'] = getNodeidFromPath(path.slice(0, -1).join(SEPARATOR))
    }

    const data = await client
      .post(apiURLs.createNode, reqData, {
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

  const getDataAPI = async (nodeid: string) => {
    const url = apiURLs.getNode(nodeid)
    if (isRequestedWithin(GET_REQUEST_MINIMUM_GAP, url)) {
      console.warn('\nAPI has been requested before, cancelling\n')
      return
    }

    // console.warn('\n\n\n\nAPI has not been requested before, requesting\n\n\n\n')
    const res = await client
      .get(apiURLs.getNode(nodeid), {
        headers: {
          [WORKSPACE_HEADER]: getWorkspaceId(),
          Accept: 'application/json, text/plain, */*'
        }
      })
      .then((d: any) => {
        return { data: d.data.data, metadata: extractMetadata(d.data.data[0]), version: d.data.version ?? undefined }
      })
      .catch(console.error)

    if (res) {
      return { content: deserializeContent(res.data), metadata: res.metadata ?? undefined, version: res.version }
    }
  }

  const getNodesByWorkspace = async (workspaceId: string) => {
    const data = await client
      .get(apiURLs.getNodesByWorkspace(workspaceId), {
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
      .then((resp) => resp.data)
      .then((data: any) => {
        if (data === nodeId) {
          const publicURL = apiURLs.getNodePublicURL(data)
          setNodePublic(data, publicURL)
          return publicURL
        } else throw new Error('Error making node public')
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
      .then((resp) => resp.data)
      .then((data: any) => {
        if (data === nodeId) {
          setNodePrivate(data)
          return data
        } else throw new Error('Error making node private')
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
