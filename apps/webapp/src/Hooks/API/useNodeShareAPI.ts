import {
  AccessLevel,
  API,
  batchArray,
  DefaultMIcons,
  deserializeContent,
  extractMetadata,
  iLinksToUpdate,
  mog,
  SHARED_NAMESPACE,
  SharedNode,
  useDataStore
} from '@mexit/core'

import { WorkerRequestType } from '../../Utils/worker'
import { runBatchWorker } from '../../Workers/controller'
import { useUpdater } from '../useUpdater'

interface SharedNodesPreset {
  status: 'success'
  data: SharedNode[]
}

interface SharedNodesErrorPreset {
  status: 'error'
  data: SharedNode[]
}

export const useNodeShareAPI = () => {
  const { updateFromContent } = useUpdater()

  const grantUsersPermission = async (nodeid: string, userids: string[], access: AccessLevel) => {
    const payload = {
      type: 'SharedNodeRequest',
      nodeID: nodeid,
      userIDs: userids,
      accessType: access
    }
    return await API.share.grantNodePermission(payload)
  }

  const changeUserPermission = async (nodeid: string, userIDToAccessTypeMap: { [userid: string]: AccessLevel }) => {
    const payload = {
      type: 'UpdateAccessTypesRequest',
      nodeID: nodeid,
      userIDToAccessTypeMap
    }
    return await API.share.updateNodePermission(payload)
  }

  const revokeUserAccess = async (nodeid: string, userids: string[]) => {
    const payload = {
      type: 'SharedNodeRequest',
      nodeID: nodeid,
      userIDs: userids
    }
    return await API.share.revokeNodeAccess(payload)
  }

  const getAllSharedNodes = async (): Promise<SharedNodesPreset | SharedNodesErrorPreset> => {
    try {
      return await API.share.getSharedNodes().then((sharedNodesRaw: any) => {
        const sharedNodes = sharedNodesRaw.map((n): SharedNode => {
          let metadata = undefined
          try {
            const basemetadata = n?.nodeMetadata
            metadata = JSON.parse(basemetadata ?? '{}')
            if (metadata?.createdAt && metadata.updatedAt) {
              return {
                path: n.nodeTitle,
                nodeid: n.nodeID,
                currentUserAccess: n.accessType,
                owner: n.ownerID,
                sharedBy: n.granterID,
                createdAt: metadata.createdAt,
                updatedAt: metadata.updatedAt,
                namespace: SHARED_NAMESPACE.id
              }
            }
          } catch (e) {
            mog('Error parsing metadata', { e })
          }

          return {
            path: n.nodeTitle,
            nodeid: n.nodeID,
            currentUserAccess: n.accessType,
            owner: n.ownerID,
            sharedBy: n.grantedID,
            namespace: SHARED_NAMESPACE.id
          }
        })

        const localSharedNodes = useDataStore.getState().sharedNodes
        const { toUpdateLocal } = iLinksToUpdate(localSharedNodes, sharedNodes)
        const ids = batchArray(
          toUpdateLocal.map((val) => val.nodeid),
          10
        )
        runBatchWorker(WorkerRequestType.GET_SHARED_NODES, 6, ids).then((res) => {
          const { fulfilled } = res

          fulfilled.forEach((batchResponse) => {
            const { rawResponse } = batchResponse

            rawResponse.forEach((node) => {
              const content = deserializeContent(node.data)
              const metadata = extractMetadata(node, { icon: DefaultMIcons.SHARED_NOTE })
              mog('Updating Shared Node', { node, content, metadata })
              updateFromContent(node.id, content, metadata)
            })
          })
        })

        mog('SharedNodes', { sharedNodes })
        return { status: 'success', data: sharedNodes }
      })
    } catch (e) {
      mog('Error Fetching Shared Nodes', { e })
      return { data: [], status: 'error' }
    }
  }

  const getUsersOfSharedNode = async (nodeid: string): Promise<{ users: Record<string, string> }> => {
    try {
      const users = await API.share.getNodePermissions(nodeid)
      return { users }
    } catch (e) {
      mog('Failed to get SharedUsers', { e })
      return { users: {} }
    }
  }

  return { grantUsersPermission, getUsersOfSharedNode, changeUserPermission, revokeUserAccess, getAllSharedNodes }
}
