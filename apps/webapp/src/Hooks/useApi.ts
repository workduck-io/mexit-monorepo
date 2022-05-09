import { client } from '@workduck-io/dwindle'

import { defaultContent, apiURLs, mog, SEPARATOR } from '@mexit/core'

import { useAuthStore } from '../Stores/useAuth'
import { removeNulls, extractMetadata } from '../Utils/content'
import { useLinks } from '../Hooks/useLinks'
import { WORKSPACE_HEADER, DEFAULT_NAMESPACE, GET_REQUEST_MINIMUM_GAP } from '../Data/constants'
import { isRequestedWithin } from '../Stores/useApiStore'
import useContentStore from '../Stores/useContentStore'
import '../Utils/apiClient'
import { deserializeContent, serializeContent } from '../Utils/serializer'
import useDataStore from '../Stores/useDataStore'
import { useInternalLinks } from './../Data/useInternalLinks'

export const useApi = () => {
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const setMetadata = useContentStore((store) => store.setMetadata)
  const setContent = useContentStore((store) => store.setContent)
  const userDetails = useAuthStore((store) => store.userDetails)
  const { getPathFromNodeid, getNodeidFromPath } = useLinks()
  const { updateILinksFromAddedRemovedPaths } = useInternalLinks()
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
      data: serializeContent(defaultContent.content)
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
        const time = Date.now()
        const metadata = {
          lastEditedBy: userDetails?.email,
          createdBy: userDetails?.email,
          createdAt: time,
          updatedAt: time
        }
        setMetadata(nodeid, extractMetadata(metadata))
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
  const saveDataAPI = async (nodeid: string, content: any[]) => {
    const path = getPathFromNodeid(nodeid).split(SEPARATOR)
    const reqData = {
      id: nodeid,
      type: 'NodeRequest',
      title: path.slice(-1)[0],
      lastEditedBy: useAuthStore.getState().userDetails.email,
      namespaceIdentifier: DEFAULT_NAMESPACE,
      data: serializeContent(content ?? defaultContent.content)
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
        const metadata = {
          createdBy: d.data.createdBy,
          createdAt: d.data.createdAt,
          lastEditedBy: d.data.lastEditedBy,
          updatedAt: d.data.updatedAt
        }

        // console.log(metadata, d.data)
        return { data: d.data.data, metadata: removeNulls(metadata), version: d.data.version ?? undefined }
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
        const nodeUID = data.nodeUID
        if (nodeUID === nodeId) {
          const publicURL = apiURLs.getNodePublicURL(nodeUID)
          setNodePublic(nodeUID, publicURL)
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
        const nodeUID = data.nodeUID
        if (nodeUID === nodeId) {
          setNodePrivate(nodeUID)
          return nodeUID
        } else throw new Error('Error making node private')
      })
      .catch((error) => {
        mog('MakeNodePrivateError', { error })
      })
  }

  const isPublic = (nodeid: string) => {
    return checkNodePublic(nodeid)
  }

  return {
    saveDataAPI,
    getDataAPI,
    saveNewNodeAPI,
    getNodesByWorkspace,
    makeNodePublic,
    makeNodePrivate,
    isPublic
  }
}
