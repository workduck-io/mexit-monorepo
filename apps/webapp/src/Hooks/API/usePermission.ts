import { client } from '@workduck-io/dwindle'

import { mog, apiURLs } from '@mexit/core'

import { AccessLevel } from '../../Types/Mentions'

export const usePermission = () => {
  const grantUsersPermission = async (nodeid: string, userids: string[], access: AccessLevel) => {
    mog('changeThat permission')
    const payload = {
      type: 'SharedNodeRequest',
      nodeID: nodeid,
      userIDs: userids,
      accessType: access
    }
    return await client.post(apiURLs.sharedNode, payload).then((resp) => {
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
    return await client.put(apiURLs.sharedNode, payload).then((resp) => {
      mog('changeUsers resp', { resp })
      return resp
    })
  }

  const revokeUserAccess = async (nodeid: string, userids: string[]) => {
    mog('changeThat permission')
    const payload = {
      type: 'SharedNodeRequest',
      nodeID: nodeid,
      userIDs: userids
    }
    return await client
      .delete(apiURLs.sharedNode, {
        data: payload
      })
      .then((resp) => {
        mog('changeUsers resp', { resp })
        return resp
      })
  }
  const getAllSharedNodes = async () => {
    return await client.get(apiURLs.allSharedNodes).then((resp) => {
      mog('changeUsers resp', { resp })
      return resp
    })
  }
  return { grantUsersPermission, changeUserPermission, revokeUserAccess, getAllSharedNodes }
}
