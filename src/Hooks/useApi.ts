import { client } from '@workduck-io/dwindle'

import { defaultContent } from '../Store/useEditorStore'
import { useAuthStore } from '../Store/useAuth'
import useContentStore from '../Store/useContentStore'
import { deserializeContent, serializeContent } from '../Utils/serializer'
import { apiURLs } from '../Utils/routes'
import { NodeMetadata } from '../Types/Data'

export const removeNulls = (obj: any): any => {
  if (obj === null) {
    return undefined
  }
  if (typeof obj === 'object') {
    for (const key in obj) {
      obj[key] = removeNulls(obj[key])
    }
  }
  return obj
}

export const extractMetadata = (data: any): NodeMetadata => {
  const metadata: any = {
    lastEditedBy: data.lastEditedBy,
    updatedAt: data.updatedAt,
    createdBy: data.createdBy,
    createdAt: data.createdAt
  }
  return removeNulls(metadata)
}

export const useApi = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const setMetadata = useContentStore((store) => store.setMetadata)
  const setContent = useContentStore((store) => store.setContent)
  /*
   * Saves data in the backend
   * Also updates the incoming data in the store
   */
  const saveNewNodeAPI = async (nodeid: string) => {
    // const reqData = {
    //   id: nodeid,
    //   type: 'NodeRequest',
    //   lastEditedBy: useAuthStore.getState().userDetails.email,
    //   namespaceIdentifier: 'NAMESPACE1',
    //   workspaceIdentifier: getWorkspaceId(),
    //   data: serializeContent(defaultContent.content)
    // }
    // setContent(nodeid, defaultContent.content)
    // const data = await client
    //   .post(apiURLs.saveNode, reqData, {})
    //   .then((d) => {
    //     setMetadata(nodeid, extractMetadata(d.data))
    //     return d.data
    //   })
    //   .catch((e) => {
    //     console.error(e)
    //   })
    // return data
  }
  /*
   * Saves data in the backend
   * Also updates the incoming data in the store
   */
  const saveDataAPI = async (nodeid: string, content: any[], nodePath?: string) => {
    console.log(`Saving NodeID: ${nodeid} | Content: ${JSON.stringify(content)}`)
    // const reqData = {
    //   id: nodeid,
    //   nodePath: nodePath,
    //   createdBy: user,
    //   workspaceIdentifier: getWorkspaceId(),
    //   content: mexit_content,
    //   lastEditedBy: useAuthStore.getState().userDetails.email,
    //   namespaceIdentifier: 'NAMESPACE1',
    //   content: content
    // }
    // const data = await client
    //   .post(apiURLs.saveNode, reqData, {})
    //   .then((d: any) => {
    //     // setMetadata(nodeid, extractMetadata(d.data))
    //     setContent(nodeid, deserializeContent(d.data.data), extractMetadata(d.data))
    //     return d.data
    //   })
    //   .catch((e) => {
    //     console.error(e)
    //   })
    // return data
  }

  const getDataAPI = async (nodeid: string) => {
    return await client
      .get(apiURLs.getNode(nodeid), {})
      .then((d: any) => {
        return { content: d.data.data, metadata: d.data.metadata }
      })
      .catch(console.error)
  }

  return { saveDataAPI, getDataAPI, saveNewNodeAPI }
}
