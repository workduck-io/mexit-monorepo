import { mog, AccessLevel, DefaultPermission, InvitedUser, Mentionable } from '@mexit/core'

import { useMentionStore, addAccessToUser } from '../Stores/useMentionsStore'
import { usePermission } from './API/usePermission'

export const useMentions = () => {
  const { grantUsersPermission } = usePermission()
  const addInvitedUser = useMentionStore((s) => s.addInvitedUser)
  const addAccess = useMentionStore((s) => s.addAccess)
  const setInvited = useMentionStore((s) => s.setInvited)
  const setMentionable = useMentionStore((s) => s.setMentionable)

  // Add access level that is returned from the backend after permissions have been given
  const inviteUser = (email: string, alias: string, nodeid: string, accessLevel: AccessLevel) => {
    const invited = useMentionStore.getState().invitedUsers
    const user = invited.find((u) => u.email === email)

    // if previously invited, update access level
    if (user) {
      addAccess(user.email, nodeid, accessLevel)
    } else {
      addInvitedUser({ type: 'invite', email, alias, access: { [nodeid]: accessLevel } })
    }
  }

  // Used when inserting existing mention/invited to the editor
  const grantUserAccessOnMention = async (alias: string, nodeid: string, access: AccessLevel = DefaultPermission) => {
    const invitedUsers = useMentionStore.getState().invitedUsers
    const mentionable = useMentionStore.getState().mentionable
    const invitedExists = invitedUsers.find((user) => user.alias === alias)
    const mentionExists = mentionable.find((user) => user.alias === alias)

    const mentionPerm = mentionExists && mentionExists.access[nodeid]
    const invitedPerm = invitedExists && invitedExists.access[nodeid]
    mog('GrantUserAccessOnMention', { alias, nodeid, access, mentionPerm, invitedPerm })
    // If the user has permission to node, no need to add it
    if (mentionPerm) return
    if (invitedPerm) return
    if (invitedExists && !mentionExists) {
      const newInvited: InvitedUser = addAccessToUser(invitedExists, nodeid, access)
      // As user not on mex no need to call backend and give permission
      setInvited([...invitedUsers.filter((user) => user.alias !== alias), newInvited])
      return newInvited
    } else if (!invitedExists && mentionExists) {
      // We know it is guaranteed to be mentionable
      // Call backend and give permission
      const res = await grantUsersPermission(nodeid, [mentionExists.userid], access)
        .then(() => {
          const newMentioned: Mentionable = addAccessToUser(mentionExists, nodeid, access) as Mentionable
          setMentionable([...mentionable.filter((user) => user.alias !== alias), newMentioned])
          return newMentioned
        })
        .catch((e) => {
          console.log('Granting permission to user failed', { e })
          return undefined
        })
      return res
    } else {
      // By design, the user should be in either invited or mentionable. The flow for new created user is different.
      console.log('SHOULD NOT RUN', {})
      return 'notFound'
      //
    }
  }

  const addMentionable = (alias: string, email: string, userid: string, nodeid: string, access: AccessLevel) => {
    const mentionable = useMentionStore.getState().mentionable

    const mentionExists = mentionable.find((user) => user.userid === userid)

    if (mentionExists) {
      mentionExists.access[nodeid] = access
      setMentionable([...mentionable.filter((u) => u.userid !== userid), mentionExists])
    } else {
      const newMention: Mentionable = {
        type: 'mentionable',
        alias,
        email,
        access: {
          [nodeid]: access
        },
        userid
      }
      setMentionable([...mentionable, newMention])
    }
  }

  const getUsernameFromUserid = (userid: string): string | undefined => {
    const mentionable = useMentionStore.getState().mentionable
    const user = mentionable.find((mention) => mention.userid === userid)
    if (user) {
      return user.alias
    } else return undefined
  }

  const getUserAccessLevelForNode = (userid: string, nodeid: string): AccessLevel | undefined => {
    const mentionable = useMentionStore.getState().mentionable
    const user = mentionable.find((mention) => mention.userid === userid)
    if (user) {
      return user.access[nodeid]
    } else return undefined
  }

  const getSharedUsersForNode = (nodeid: string): Mentionable[] => {
    const mentionable = useMentionStore.getState().mentionable
    const users = mentionable.filter((mention) => mention.access[nodeid] !== undefined)
    return users
  }

  const getInvitedUsersForNode = (nodeid: string): InvitedUser[] => {
    const invitedUsers = useMentionStore.getState().invitedUsers
    const users = invitedUsers.filter((mention) => mention.access[nodeid] !== undefined)
    return users
  }

  const getUserFromUserid = (userid: string): Mentionable | InvitedUser | undefined => {
    const mentionable = useMentionStore.getState().mentionable
    const user = mentionable.find((mention) => mention.userid === userid)
    if (user) {
      return user
    } else {
      // If the user is invited only, the userid is the alias
      const invited = useMentionStore.getState().invitedUsers
      const invitedUser = invited.find((u) => u.alias === userid)
      if (invitedUser) {
        return invitedUser
      }
    }
    return undefined
  }

  const applyChangesMentionable = (
    newPermissions: { [userid: string]: AccessLevel },
    newAliases: { [userid: string]: string },
    revoked: string[],
    nodeid: string
  ) => {
    mog('applyChanges', { newPermissions, newAliases, revoked })

    const oldMentionable = useMentionStore.getState().mentionable

    const afterRevoked = oldMentionable.map((u) => {
      if (revoked.includes(u.userid)) {
        delete u.access[nodeid]
        return u
      }
      return u
    })
    const afterAliasChange = afterRevoked.map((u) => {
      if (Object.keys(newAliases).includes(u.userid)) return { ...u, alias: newAliases[u.userid] }
      return u
    })
    const afterAccessChange = afterAliasChange.map((u) => {
      if (Object.keys(newPermissions).includes(u.userid))
        return {
          ...u,
          access: {
            ...u.access,
            [nodeid]: newPermissions[u.userid]
          }
        }
      return u
    })

    mog('AfterApplying the changes', { oldMentionable, afterRevoked, afterAliasChange, afterAccessChange })

    setMentionable(afterAccessChange)
  }

  return {
    getUsernameFromUserid,
    getUserFromUserid,
    inviteUser,
    addMentionable,
    getUserAccessLevelForNode,
    getSharedUsersForNode,
    getInvitedUsersForNode,
    grantUserAccessOnMention,
    applyChangesMentionable
  }
}

export const getAccessValue = (access: AccessLevel): { value: AccessLevel; label: string } => {
  switch (access) {
    case 'READ':
      return { value: 'READ', label: 'View' }
    case 'WRITE':
      return { value: 'WRITE', label: 'Edit' }
    case 'MANAGE':
      return { value: 'MANAGE', label: 'Manage' }
    default:
      return { value: 'MANAGE', label: 'Manage' }
  }
}
