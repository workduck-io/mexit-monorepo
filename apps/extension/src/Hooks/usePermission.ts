import { client } from '@workduck-io/dwindle'

import { mog, apiURLs, AccessLevel, SharedNode } from '@mexit/core'

import { useAuthStore } from './useAuth'

interface SharedNodesPreset {
  status: 'success'
  data: SharedNode[]
}

interface SharedNodesErrorPreset {
  status: 'error'
  data: SharedNode[]
}

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

  const getAllSharedNodes = async (): Promise<SharedNodesPreset | SharedNodesErrorPreset> => {
    try {
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
              currentUserAccess: n.accessType,
              owner: n.ownerID,
              sharedBy: n.grantedID
            })
          )
          mog('SharedNodes', { sharedNodes })
          return { status: 'success', data: sharedNodes }
        })
    } catch (e) {
      mog('Error Fetching Shared Nodes', { e })
      return { data: [], status: 'error' }
    }
  }

  const getUsersOfSharedNode = async (nodeid: string): Promise<{ nodeid: string; users: Record<string, string> }> => {
    try {
      return await client
        .get(apiURLs.getUsersOfSharedNode(nodeid), {
          headers: {
            'mex-workspace-id': workspaceDetails.id
          }
        })
        .then((resp: any) => {
          mog('getAllSharedUsers For Node resp', { resp })
          return { nodeid, users: resp.data }
        })
    } catch (e) {
      mog('Failed to get SharedUsers', { e })
      return { nodeid, users: {} }
    }
  }
  return { grantUsersPermission, changeUserPermission, revokeUserAccess, getAllSharedNodes, getUsersOfSharedNode }
}
