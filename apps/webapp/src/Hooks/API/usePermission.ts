import { client } from '@workduck-io/dwindle'

import { apiURLs, mog } from '@mexit/core'

import { AccessLevel } from '../../Types/Mentions'

export const usePermission = () => {
  const grantUsersPermission = (nodeid: string, userids: string[], access: AccessLevel) => {
    mog('changeThat permission')
    const payload = {
      type: 'SharedNodeRequest',
      nodeID: nodeid,
      userIDs: userids,
      accessType: access
    }
    client.post(apiURLs.sharedNode, payload).then((resp) => {
      mog('grantPermission resp', { resp })
    })
  }

  const changeUserPermission = (nodeid: string, userIDToAccessTypeMap: { [userid: string]: string }) => {
    mog('changeThat permission')
    const payload = {
      type: 'UpdateAccessTypesRequest',
      nodeID: nodeid,
      userIDToAccessTypeMap
    }
    client.put(apiURLs.sharedNode, payload).then((resp) => {
      mog('changeUsers resp', { resp })
    })
  }

  const revokeUserAccess = (nodeid: string, userids: string[]) => {
    mog('changeThat permission')
    const payload = {
      type: 'SharedNodeRequest',
      nodeID: nodeid,
      userIDs: userids
    }
    client
      .delete(apiURLs.sharedNode, {
        data: payload
      })
      .then((resp) => {
        mog('changeUsers resp', { resp })
      })
  }
  return { grantUsersPermission, changeUserPermission, revokeUserAccess }
}
