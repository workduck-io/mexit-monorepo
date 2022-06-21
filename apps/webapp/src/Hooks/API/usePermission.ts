import { client } from '@workduck-io/dwindle'

import { mog, apiURLs, AccessLevel, SharedNode } from '@mexit/core'

import { useAuthStore } from '../../Stores/useAuth'

export const usePermission = () => {
  const workspaceDetails = useAuthStore((s) => s.workspaceDetails)
  const grantUsersPermission = async (nodeid: string, userids: string[], access: AccessLevel) => {
    mog('changeThat permission')
    const payload = {
      type: 'SharedNodeRequest',
      nodeID: nodeid,
      userIDs: userids,
      accessType: access
    }
    return await client
      .post(apiURLs.sharedNode, payload, {
        headers: {
          'mex-workspace-id': workspaceDetails.id
        }
      })
      .then((resp) => {
        mog('grantPermission resp', { resp })
        return resp
      })
  }

  const changeUserPermission = async (nodeid: string, userIDToAccessTypeMap: { [userid: string]: AccessLevel }) => {
    mog('changeThat permission')
    const payload = {
      type: 'UpdateAccessTypesRequest',
      nodeID: nodeid,
      userIDToAccessTypeMap
    }
    return await client
      .put(apiURLs.sharedNode, payload, {
        headers: {
          'mex-workspace-id': workspaceDetails.id
        }
      })
      .then((resp) => {
        mog('changeUsers resp', { resp })
        return resp
      })
  }

  const revokeUserAccess = async (nodeid: string, userids: string[]) => {
    const payload = {
      type: 'SharedNodeRequest',
      nodeID: nodeid,
      userIDs: userids
    }
    return await client
      .delete(apiURLs.sharedNode, {
        data: payload,
        headers: {
          'mex-workspace-id': workspaceDetails.id
        }
      })
      .then((resp) => {
        mog('revoke That permission resp', { resp })
        return resp
      })
  }

  const getAllSharedNodes = async () => {
    return await client
      .get(apiURLs.allSharedNodes, {
        headers: {
          'mex-workspace-id': workspaceDetails.id
        }
      })
      .then((resp) => {
        mog('getAllSharedNodes resp', { resp })
        return resp.data
      })
      .then((sharedNodesRaw: any) => {
        const sharedNodes = sharedNodesRaw.map(
          (n): SharedNode => ({
            path: n.nodeTitle,
            nodeid: n.nodeID,
            access: n.accessType
          })
        )
        mog('SharedNodes', { sharedNodes })
        return sharedNodes
      })
  }

  const getUsersOfSharedNode = async (nodeid: string) => {
    return await client
      .get(apiURLs.getUsersOfSharedNode(nodeid), {
        headers: {
          'mex-workspace-id': workspaceDetails.id
        }
      })
      .then((resp) => {
        mog('getAllSharedUsers For Node resp', { resp })
        return resp.data
      })
  }

  return { grantUsersPermission, changeUserPermission, revokeUserAccess, getAllSharedNodes, getUsersOfSharedNode }
}
